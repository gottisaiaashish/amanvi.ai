import { getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import '../../src/config/firebase.js'; // Ensure Firebase is initialized
import User from '../models/User.js';

// In-memory state for quick low-latency updates
export const laptopState = {
  deviceId: 'amanvi-laptop-primary',
  deviceName: 'My Primary Laptop',
  status: 'offline', // 'offline' | 'online' | 'locked' | 'unlocked'
  isLocked: true,
  lastBootTime: null,
  lastSeen: null,
  battery: {
    level: 100,
    isCharging: false,
    hasBattery: true
  },
  system: {
    hostname: '',
    platform: 'win32',
    cpuUsage: 0,
    memoryUsage: 0,
    activeWindow: 'Desktop'
  },
  network: {
    ip: '127.0.0.1',
    wifiSSID: 'Home WiFi'
  },
  location: {
    city: null,
    region: null,
    country: null,
    lat: null,
    lon: null,
    org: null
  },
  snapshots: [],
  logs: []
};

let ioInstance = null;

export const initSentinelService = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Sentinel Socket] Client connected: ${socket.id}`);

    // Client registration (Laptop Agent or Mobile App)
    socket.on('register_device', (data) => {
      const { role, deviceId, deviceName } = data || {};
      socket.deviceRole = role; // 'laptop_agent' or 'mobile_app'
      socket.deviceId = deviceId || 'amanvi-laptop-primary';

      console.log(`[Sentinel Socket] Registered role: ${role} (${socket.deviceId})`);

      if (role === 'laptop_agent') {
        laptopState.status = laptopState.isLocked ? 'locked' : 'online';
        laptopState.lastSeen = new Date().toISOString();
        if (deviceName) laptopState.deviceName = deviceName;

        // Broadcast to mobile apps
        io.emit('sentinel_state_change', laptopState);
      } else if (role === 'mobile_app') {
        // Send initial state to newly connected mobile app
        socket.emit('sentinel_state_change', laptopState);
      }
    });

    // Laptop Boot Alert
    socket.on('laptop_boot_alert', async (data) => {
      console.log('🚨 [Sentinel] LAPTOP BOOT ALERT RECEIVED!', data);
      laptopState.status = 'locked';
      laptopState.isLocked = true;
      laptopState.lastBootTime = new Date().toISOString();
      laptopState.lastSeen = new Date().toISOString();
      if (data?.battery) laptopState.battery = { ...laptopState.battery, ...data.battery };
      if (data?.network) laptopState.network = { ...laptopState.network, ...data.network };
      if (data?.location) laptopState.location = { ...laptopState.location, ...data.location };

      addLog('BOOT_ALERT', 'Laptop powered on and entered Guardian Lock mode');

      // 1. Socket broadcast to active mobile app
      io.emit('laptop_boot_alert', {
        timestamp: laptopState.lastBootTime,
        message: '🚨 Alert: Your Laptop just turned on! Face unlock required.',
        state: laptopState
      });
      io.emit('sentinel_state_change', laptopState);

      // 2. Send Push Notification via Firebase Cloud Messaging
      await sendBootPushNotification();
    });

    // Telemetry Update
    socket.on('laptop_telemetry', (telemetry) => {
      laptopState.lastSeen = new Date().toISOString();
      laptopState.status = laptopState.isLocked ? 'locked' : 'online';
      if (telemetry.battery) laptopState.battery = telemetry.battery;
      if (telemetry.system) laptopState.system = { ...laptopState.system, ...telemetry.system };
      if (telemetry.network) laptopState.network = { ...laptopState.network, ...telemetry.network };
      if (telemetry.location) laptopState.location = { ...laptopState.location, ...telemetry.location };
      if (typeof telemetry.isLocked === 'boolean') laptopState.isLocked = telemetry.isLocked;

      // Broadcast to mobile app
      io.emit('sentinel_telemetry', laptopState);
    });

    // Mobile App requests Unlock
    socket.on('mobile_unlock_laptop', (authData) => {
      console.log('🔓 [Sentinel] Mobile Face/Biometric Unlock Command Received:', authData);
      laptopState.isLocked = false;
      laptopState.status = 'online';
      addLog('UNLOCKED', `Unlocked remotely via ${authData?.authMethod || 'Mobile Face ID'}`);

      // Notify Laptop Agent to release lock screen
      io.emit('command_unlock_laptop', {
        unlockedAt: new Date().toISOString(),
        authMethod: authData?.authMethod || 'Mobile Biometrics'
      });

      // Notify Mobile UI
      io.emit('sentinel_state_change', laptopState);
    });

    // Mobile App requests Lock
    socket.on('mobile_lock_laptop', () => {
      console.log('🔒 [Sentinel] Mobile Remote Lock Command Received');
      laptopState.isLocked = true;
      laptopState.status = 'locked';
      addLog('LOCKED', 'Locked remotely from Mobile App');

      // Command Laptop Agent to activate lock screen
      io.emit('command_lock_laptop', {
        lockedAt: new Date().toISOString()
      });

      io.emit('sentinel_state_change', laptopState);
    });

    // Snapshot received from Laptop camera
    socket.on('laptop_snapshot_uploaded', (snapshotData) => {
      const entry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: snapshotData.imageUrl || snapshotData.base64,
        trigger: snapshotData.trigger || 'manual_request'
      };
      laptopState.snapshots.unshift(entry);
      if (laptopState.snapshots.length > 20) laptopState.snapshots.pop();

      addLog('SNAPSHOT', `Webcam capture recorded (${entry.trigger})`);
      io.emit('sentinel_new_snapshot', entry);
      io.emit('sentinel_state_change', laptopState);
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.deviceRole === 'laptop_agent') {
        console.log(`[Sentinel Socket] Laptop Agent disconnected: ${socket.id}`);
        laptopState.status = 'offline';
        addLog('OFFLINE', 'Laptop disconnected or powered off');
        io.emit('sentinel_state_change', laptopState);
      }
    });
  });
};

function addLog(type, message) {
  laptopState.logs.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    type,
    message
  });
  if (laptopState.logs.length > 50) laptopState.logs.pop();
}

// In-memory token cache for fast non-blocking delivery
const activeFcmTokens = new Set();

async function sendBootPushNotification() {
  try {
    if (!getApps().length) {
      console.log('[Sentinel FCM] Firebase Admin is not initialized, skipping push');
      return;
    }

    const tokens = new Set(activeFcmTokens);

    // If MongoDB is connected, also fetch tokens from database
    if (mongoose.connection.readyState === 1) {
      try {
        const users = await Promise.race([
          User.find({ fcmToken: { $exists: true, $ne: null } }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
        if (users && users.length > 0) {
          users.forEach(u => { if (u.fcmToken) tokens.add(u.fcmToken); });
        }
      } catch (dbErr) {
        console.warn('[Sentinel FCM] Could not fetch DB tokens:', dbErr.message);
      }
    }

    const tokenList = Array.from(tokens);
    if (tokenList.length === 0) {
      console.log('[Sentinel FCM] No registered FCM tokens to dispatch to');
      return;
    }

    const messaging = getMessaging();

    const response = await messaging.sendEachForMulticast({
      tokens: tokenList,
      notification: {
        title: '🚨 Alert: Laptop Powered ON!',
        body: 'Your laptop just started. Open Amanvi AI to verify with Face Unlock.',
      },
      data: {
        type: 'LAPTOP_BOOT_ALERT',
        action: 'UNLOCK_PROMPT',
        timestamp: new Date().toISOString()
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'sentinel_alerts',
          priority: 'max',
          visibility: 'public',
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            contentAvailable: true
          }
        }
      }
    });

    console.log(`[Sentinel FCM] Push sent. Success: ${response.successCount}, Failed: ${response.failureCount}`);

    // Log any failures
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.warn(`[Sentinel FCM] Token ${tokens[idx]} failed:`, resp.error?.message);
      }
    });
  } catch (err) {
    console.error('[Sentinel FCM Error]:', err.message);
  }
}

export const getLaptopState = () => laptopState;

export const unlockLaptopFromApi = (authMethod = 'Mobile Face ID') => {
  laptopState.isLocked = false;
  laptopState.status = 'online';
  addLog('UNLOCKED', `Unlocked via ${authMethod}`);
  if (ioInstance) {
    ioInstance.emit('command_unlock_laptop', {
      unlockedAt: new Date().toISOString(),
      authMethod
    });
    ioInstance.emit('sentinel_state_change', laptopState);
  }
  return laptopState;
};

export const lockLaptopFromApi = () => {
  laptopState.isLocked = true;
  laptopState.status = 'locked';
  addLog('LOCKED', 'Locked via API/Mobile');
  if (ioInstance) {
    ioInstance.emit('command_lock_laptop', {
      lockedAt: new Date().toISOString()
    });
    ioInstance.emit('sentinel_state_change', laptopState);
  }
  return laptopState;
};

export const sendCustomCommand = (action, payload = {}) => {
  addLog('COMMAND', `Executed action: ${action}`);
  if (ioInstance) {
    ioInstance.emit('command_execute', { action, payload });
  }
  return { success: true, action };
};

export const triggerTestBootAlert = async () => {
  laptopState.status = 'locked';
  laptopState.isLocked = true;
  laptopState.lastBootTime = new Date().toISOString();
  addLog('BOOT_ALERT', 'Test Boot Notification triggered from admin');

  if (ioInstance) {
    ioInstance.emit('laptop_boot_alert', {
      timestamp: laptopState.lastBootTime,
      message: '🚨 Alert: Your Laptop just turned on! Face unlock required.',
      state: laptopState
    });
    ioInstance.emit('sentinel_state_change', laptopState);
  }

  await sendBootPushNotification();
  return { success: true, message: 'Boot Alert and Push notification dispatched', state: laptopState };
};

// Register/update FCM token for a user
export const registerFcmToken = async (userId, fcmToken) => {
  try {
    if (fcmToken) activeFcmTokens.add(fcmToken);

    if (mongoose.connection.readyState === 1 && userId) {
      await User.findOneAndUpdate(
        { _id: userId },
        { fcmToken },
        { upsert: false }
      );
    }
    addLog('FCM_REGISTER', `FCM token registered for ${userId || 'device'}`);
    return { success: true };
  } catch (err) {
    console.error('[Sentinel FCM Register Error]:', err.message);
    return { success: false, error: err.message };
  }
};
