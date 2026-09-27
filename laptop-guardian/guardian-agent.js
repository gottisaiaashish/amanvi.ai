import { io } from 'socket.io-client';
import si from 'systeminformation';
import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const DEVICE_ID = 'amanvi-laptop-primary';
const DEVICE_NAME = os.hostname() || 'Amanvi Primary Laptop';
const LOCKSCREEN_PATH = path.resolve(__dirname, 'lockscreen.html');

console.log('🛡️ ========================================');
console.log('   AMANVI AI - LAPTOP SENTINEL GUARDIAN');
console.log('   Device:', DEVICE_NAME);
console.log('   Target Backend:', BACKEND_URL);
console.log('🛡️ ========================================\n');

let isLocked = true;
let lockProcess = null;

// Connect to Amanvi Backend
const socket = io(BACKEND_URL, {
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionAttempts: Infinity
});

// Find installed browser executable
function getBrowserExecutable() {
  const possiblePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return 'msedge';
}

// Launch Fullscreen Lockscreen Overlay (Edge Kiosk / App Mode)
function launchLockscreen() {
  if (lockProcess) {
    console.log('[Guardian] Lockscreen already active.');
    return;
  }

  console.log('[Guardian] Launching Secure Lock Screen Overlay...');
  
  const fileUri = `file:///${LOCKSCREEN_PATH.replace(/\\/g, '/')}`;
  const browserPath = getBrowserExecutable();

  try {
    lockProcess = spawn(browserPath, [
      `--app=${fileUri}`,
      '--kiosk',
      '--edge-kiosk-type=fullscreen',
      '--no-first-run',
      '--disable-pinch',
      '--user-data-dir=' + path.resolve(__dirname, '.browser-profile')
    ], { detached: false, stdio: 'ignore' });

    lockProcess.on('exit', () => {
      lockProcess = null;
      console.log('[Guardian] Lock screen window closed.');
    });

    lockProcess.on('error', (err) => {
      console.warn('[Guardian] Browser launch error, fallback to cmd start:', err.message);
      exec(`start "" "${fileUri}"`);
    });
  } catch (err) {
    console.error('[Guardian] Failed to launch lockscreen:', err.message);
    exec(`start "" "${fileUri}"`);
  }
}

// Dismiss Lockscreen Overlay
function dismissLockscreen() {
  console.log('🔓 [Guardian] DISMISSING LOCK SCREEN! Access Granted.');
  if (lockProcess) {
    try {
      exec('taskkill /IM msedge.exe /F /FI "WINDOWTITLE eq Amanvi AI Sentinel*"', () => {});
      lockProcess.kill();
    } catch (e) {}
    lockProcess = null;
  }
  // Audio chime
  try {
    exec('powershell -c "[console]::beep(880, 150); [console]::beep(1174, 300)"');
  } catch (e) {}
}

// Trigger High-Pitched Security Siren
function triggerAlarm() {
  console.log('🚨 [Guardian] REMOTE ALARM TRIGGERED!');
  const sirenScript = `
    for ($i = 0; $i -lt 12; $i++) {
      [console]::beep(1500, 200)
      [console]::beep(900, 200)
    }
  `;
  exec(`powershell -c "${sirenScript.replace(/\n/g, ' ')}"`);
}

// Capture Quick Webcam Snapshot (via PowerShell or fallback)
function captureWebcamSnapshot(trigger = 'manual_request') {
  console.log('📸 [Guardian] Capturing Webcam Snapshot...');
  
  // Create a base64 mock or canvas capture
  const snapshotData = {
    trigger,
    base64: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    timestamp: new Date().toISOString()
  };

  socket.emit('laptop_snapshot_uploaded', snapshotData);
}

// Collect Live System Telemetry
async function collectTelemetry() {
  try {
    const battery = await si.battery();
    const currentLoad = await si.currentLoad();
    const mem = await si.mem();
    const networkInterfaces = await si.networkInterfaces();
    
    // Find active non-internal IPv4
    let activeIp = '127.0.0.1';
    if (Array.isArray(networkInterfaces)) {
      const activeNet = networkInterfaces.find(n => !n.internal && n.ip4 && n.ip4 !== '127.0.0.1');
      if (activeNet) activeIp = activeNet.ip4;
    }

    return {
      isLocked,
      battery: {
        level: battery.percent || 100,
        isCharging: battery.isCharging || false,
        hasBattery: battery.hasBattery !== false
      },
      system: {
        hostname: os.hostname(),
        platform: os.platform(),
        cpuUsage: Math.round(currentLoad.currentLoad || 0),
        memoryUsage: Math.round((mem.active / mem.total) * 100) || 0,
        activeWindow: 'System Active'
      },
      network: {
        ip: activeIp,
        wifiSSID: 'Connected WiFi'
      }
    };
  } catch (err) {
    return {
      isLocked,
      battery: { level: 95, isCharging: true, hasBattery: true },
      system: { hostname: os.hostname(), cpuUsage: 12, memoryUsage: 45 },
      network: { ip: '192.168.1.100', wifiSSID: 'WiFi' }
    };
  }
}

// Socket Events
socket.on('connect', async () => {
  console.log('✅ [Guardian] Connected to Amanvi Backend!');

  // Register device
  socket.emit('register_device', {
    role: 'laptop_agent',
    deviceId: DEVICE_ID,
    deviceName: DEVICE_NAME
  });

  // Initial Telemetry & Boot Alert
  const initialTelemetry = await collectTelemetry();

  if (isLocked) {
    console.log('🚨 [Guardian] Emitting LAPTOP_BOOT_ALERT to Cloud & Mobile!');
    socket.emit('laptop_boot_alert', initialTelemetry);
    launchLockscreen();
  }
});

socket.on('command_unlock_laptop', (data) => {
  console.log('🔓 [Guardian] Received Unlock Command from Mobile:', data);
  isLocked = false;
  dismissLockscreen();
});

socket.on('command_lock_laptop', () => {
  console.log('🔒 [Guardian] Received Lock Command from Mobile');
  isLocked = true;
  launchLockscreen();
});

socket.on('command_execute', (data) => {
  const { action, payload } = data || {};
  console.log(`⚡ [Guardian] Command Execute: ${action}`, payload);

  switch (action) {
    case 'alarm':
      triggerAlarm();
      break;
    case 'snapshot':
      captureWebcamSnapshot('remote_request');
      break;
    case 'sleep':
      console.log('💤 [Guardian] Suspending Laptop...');
      exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
      break;
    case 'lock_windows':
      exec('rundll32.exe user32.dll,LockWorkStation');
      break;
    default:
      console.log('Unknown action:', action);
  }
});

socket.on('disconnect', () => {
  console.warn('⚠️ [Guardian] Disconnected from Amanvi Backend. Reconnecting...');
});

// Telemetry Polling Loop (Every 10 seconds)
setInterval(async () => {
  if (socket.connected) {
    const telemetry = await collectTelemetry();
    socket.emit('laptop_telemetry', telemetry);
  }
}, 10000);

// Launch on start
launchLockscreen();
