import admin from 'firebase-admin';
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

async function sendBootPushNotification() {
  try {
    if (!admin || !admin.apps || !admin.apps.length) {
      console.log('[Sentinel FCM] Firebase Admin is not configured, skipping push');
      return;
    }

    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    if (!users || users.length === 0) {
      console.log('[Sentinel FCM] No users with FCM token found');
      return;
    }

    const tokens = users.map(u => u.fcmToken).filter(Boolean);
    if (tokens.length === 0) return;

    const payload = {
      notification: {
        title: '🚨 Alert: Laptop Powered ON!',
        body: 'Your laptop just started. Open Amanvi AI to verify with Face Unlock.',
      },
      data: {
        type: 'LAPTOP_BOOT_ALERT',
        action: 'UNLOCK_PROMPT',
        timestamp: new Date().toISOString()
      }
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload
    });
    console.log(`[Sentinel FCM] Push sent. Success: ${response.successCount}, Failed: ${response.failureCount}`);
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
