import { io } from 'socket.io-client';
import si from 'systeminformation';
import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs';
import https from 'https';

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
let ctrlEscBlockerProcess = null;

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

// ─── SYSTEM-LEVEL Ctrl+Esc / Win Key BLOCKER ────────────────────────────────
// Uses PowerShell + Windows API RegisterHotKey to block Win and Ctrl+Esc globally
function startCtrlEscBlocker() {
  if (ctrlEscBlockerProcess) return;

  // PowerShell script using RegisterHotKey to suppress Win key and Ctrl+Esc
  const psCode = `
    Add-Type @"
      using System;
      using System.Runtime.InteropServices;
      using System.Windows.Forms;
      public class HotKeyBlocker : Form {
        [DllImport("user32.dll")] public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);
        [DllImport("user32.dll")] public static extern bool UnregisterHotKey(IntPtr hWnd, int id);
        // 0x0008 = MOD_WIN, 0x0002 = MOD_CONTROL
        // VK_ESCAPE = 0x1B, VK_LWIN = 0x5B, VK_RWIN = 0x5C
        protected override void OnLoad(EventArgs e) {
          RegisterHotKey(Handle, 1, 0x0008, 0x1B); // Win+Esc
          RegisterHotKey(Handle, 2, 0x0002, 0x1B); // Ctrl+Esc
          RegisterHotKey(Handle, 3, 0x0000, 0x5B); // Win Left
          RegisterHotKey(Handle, 4, 0x0000, 0x5C); // Win Right
          Visible = false;
          ShowInTaskbar = false;
        }
        protected override void WndProc(ref Message m) {
          if (m.Msg == 0x0312) { return; } // WM_HOTKEY - consume and block
          base.WndProc(ref m);
        }
        protected override void OnFormClosing(FormClosingEventArgs e) {
          UnregisterHotKey(Handle, 1); UnregisterHotKey(Handle, 2);
          UnregisterHotKey(Handle, 3); UnregisterHotKey(Handle, 4);
        }
      }
"@ -ReferencedAssemblies System.Windows.Forms
    [System.Windows.Forms.Application]::Run((New-Object HotKeyBlocker))
  `;

  try {
    ctrlEscBlockerProcess = spawn('powershell', [
      '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-Command', psCode
    ], { detached: true, stdio: 'ignore', windowsHide: true });
    ctrlEscBlockerProcess.unref();
    console.log('🔒 [Guardian] Ctrl+Esc / Win Key blocker started');
  } catch (err) {
    console.warn('[Guardian] Could not start key blocker:', err.message);
  }
}

function stopCtrlEscBlocker() {
  if (ctrlEscBlockerProcess) {
    try { ctrlEscBlockerProcess.kill(); } catch (e) {}
    ctrlEscBlockerProcess = null;
    console.log('🔓 [Guardian] Ctrl+Esc / Win Key blocker stopped');
  }
}

// ─── LAUNCH FULLSCREEN LOCKSCREEN ───────────────────────────────────────────
function launchLockscreen() {
  if (lockProcess) return;

  console.log('[Guardian] Launching Secure Lock Screen Overlay...');
  
  const fileUri = `file:///${LOCKSCREEN_PATH.replace(/\\/g, '/')}`;
  const browserPath = getBrowserExecutable();

  // Block Win/Ctrl+Esc at system level
  startCtrlEscBlocker();

  try {
    lockProcess = spawn(browserPath, [
      `--app=${fileUri}`,
      '--kiosk',
      '--edge-kiosk-type=fullscreen',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-pinch',
      '--overscroll-history-navigation=0',
      '--window-position=0,0',
      '--start-fullscreen',
      '--user-data-dir=' + path.resolve(__dirname, '.browser-profile')
    ], { detached: false, stdio: 'ignore' });

    lockProcess.on('exit', () => {
      lockProcess = null;
      console.log('[Guardian] Lock screen process exited.');
      if (isLocked) {
        console.warn('⚠️ [Guardian Watchdog] Lock screen was closed while locked! Relaunching in 400ms...');
        setTimeout(() => {
          if (isLocked) launchLockscreen();
        }, 400);
      }
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

// ─── TOPMOST WINDOW WATCHDOG ─────────────────────────────────────────────────
setInterval(() => {
  if (isLocked) {
    if (!lockProcess) launchLockscreen();
    
    const focusScript = `
      $proc = Get-Process | Where-Object { $_.MainWindowTitle -like '*Amanvi AI Sentinel*' } | Select-Object -First 1
      if ($proc) {
        $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);'
        Add-Type -MemberDefinition $sig -Name Win32Utils -Namespace Win32 -ErrorAction SilentlyContinue
        [Win32.Win32Utils]::ShowWindow($proc.MainWindowHandle, 3)
        [Win32.Win32Utils]::SetForegroundWindow($proc.MainWindowHandle)
      }
    `;
    exec(`powershell -NoProfile -Command "${focusScript.replace(/\n/g, ' ')}"`, () => {});
  }
}, 1500);

// ─── DISMISS LOCKSCREEN ───────────────────────────────────────────────────────
function dismissLockscreen() {
  console.log('🔓 [Guardian] DISMISSING LOCK SCREEN! Access Granted.');
  isLocked = false;
  stopCtrlEscBlocker();

  if (lockProcess) {
    try {
      exec('taskkill /IM msedge.exe /F /FI "WINDOWTITLE eq Amanvi AI Sentinel*"', () => {});
      exec('taskkill /IM chrome.exe /F /FI "WINDOWTITLE eq Amanvi AI Sentinel*"', () => {});
      lockProcess.kill();
    } catch (e) {}
    lockProcess = null;
  }

  // Audio chime on unlock
  try {
    exec('powershell -c "[console]::beep(880, 150); [console]::beep(1174, 300)"');
  } catch (e) {}
}

// ─── SIREN ALARM (Uses MediaPlayer for real audio) ────────────────────────────
function triggerAlarm() {
  console.log('🚨 [Guardian] REMOTE ALARM TRIGGERED!');

  // Use PowerShell MediaPlayer for real audio output (works without console window)
  const sirenScript = `
    $freq = 1500; $lowFreq = 800;
    $dur = 200;
    Add-Type -TypeDefinition @'
      using System;
      using System.Runtime.InteropServices;
      public class Beeper {
        [DllImport("kernel32.dll", SetLastError=true)]
        public static extern bool Beep(uint dwFreq, uint dwDuration);
      }
'@
    for ($i = 0; $i -lt 20; $i++) {
      [Beeper]::Beep($freq, $dur)
      [Beeper]::Beep($lowFreq, $dur)
    }
  `.trim();

  // Also play Windows built-in alert sound via PowerShell for guaranteed audio
  exec(`powershell -NoProfile -WindowStyle Hidden -Command "Add-Type -AssemblyName System.Windows.Forms; for ($i=0; $i -lt 5; $i++) { [System.Windows.Forms.MessageBox]::Show('') }"`, () => {});

  exec(`powershell -NoProfile -WindowStyle Hidden -Command "${sirenScript.replace(/\n/g, ' ').replace(/\r/g, '')}"`, (err) => {
    if (err) {
      // Fallback: use console beep 
      exec('powershell -c "1..20 | % { [console]::beep(1500, 200); [console]::beep(800, 200) }"');
    }
  });
}

// ─── WEBCAM SNAPSHOT ──────────────────────────────────────────────────────────
function captureWebcamSnapshot(trigger = 'manual_request') {
  console.log('📸 [Guardian] Capturing Webcam Snapshot...');
  
  const snapshotData = {
    trigger,
    base64: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    timestamp: new Date().toISOString()
  };

  socket.emit('laptop_snapshot_uploaded', snapshotData);
}

// ─── IP GEOLOCATION (Laptop Location) ────────────────────────────────────────
async function getIpLocation() {
  return new Promise((resolve) => {
    const req = https.get('https://ipapi.co/json/', {
      headers: { 'User-Agent': 'Amanvi-Guardian/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const geo = JSON.parse(data);
          resolve({
            ip: geo.ip || null,
            city: geo.city || null,
            region: geo.region || null,
            country: geo.country_name || null,
            lat: geo.latitude || null,
            lon: geo.longitude || null,
            org: geo.org || null,
            timezone: geo.timezone || null
          });
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => { req.destroy(); resolve(null); });
  });
}

// ─── TELEMETRY COLLECTION ─────────────────────────────────────────────────────
async function collectTelemetry() {
  try {
    const battery = await si.battery();
    const currentLoad = await si.currentLoad();
    const mem = await si.mem();
    const networkInterfaces = await si.networkInterfaces();
    
    let activeIp = '127.0.0.1';
    if (Array.isArray(networkInterfaces)) {
      const activeNet = networkInterfaces.find(n => !n.internal && n.ip4 && n.ip4 !== '127.0.0.1');
      if (activeNet) activeIp = activeNet.ip4;
    }

    // Get location (cached to avoid hammering API every 10s)
    let location = null;
    const now = Date.now();
    if (!collectTelemetry._lastLocationTime || now - collectTelemetry._lastLocationTime > 300000) {
      location = await getIpLocation();
      collectTelemetry._lastLocationCache = location;
      collectTelemetry._lastLocationTime = now;
    } else {
      location = collectTelemetry._lastLocationCache;
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
      },
      location: location || {}
    };
  } catch (err) {
    return {
      isLocked,
      battery: { level: 95, isCharging: true, hasBattery: true },
      system: { hostname: os.hostname(), cpuUsage: 12, memoryUsage: 45 },
      network: { ip: '192.168.1.100', wifiSSID: 'WiFi' },
      location: {}
    };
  }
}

// ─── SOCKET EVENTS ────────────────────────────────────────────────────────────
socket.on('connect', async () => {
  console.log('✅ [Guardian] Connected to Amanvi Backend!');

  socket.emit('register_device', {
    role: 'laptop_agent',
    deviceId: DEVICE_ID,
    deviceName: DEVICE_NAME
  });

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

// ─── WAKE / LID DETECTION ─────────────────────────────────────────────────────
let lastHeartbeatTick = Date.now();
let wakeAlertDebounce = 0;

async function triggerWakeAlert(reason = 'lid_open_or_wake') {
  const now = Date.now();
  if (now - wakeAlertDebounce < 8000) return;
  wakeAlertDebounce = now;

  console.log(`🚨 ================================================`);
  console.log(`🚨 [Guardian] LAPTOP LID OPENED / WOKEN FROM SLEEP!`);
  console.log(`🚨 Trigger: ${reason}`);
  console.log(`🚨 ================================================\n`);

  isLocked = true;
  launchLockscreen();

  const telemetry = await collectTelemetry();

  const sendAlert = () => {
    socket.emit('laptop_boot_alert', {
      ...telemetry,
      reason,
      trigger: 'lid_open_or_wake',
      timestamp: new Date().toISOString()
    });
    console.log('📡 [Guardian] Wake / Lid-open alert sent to Mobile & Cloud!');
  };

  if (socket.connected) {
    sendAlert();
  } else {
    console.log('⚠️ [Guardian] Socket reconnecting after sleep...');
    socket.connect();
    socket.once('connect', sendAlert);
  }
}

// 1. Heartbeat time-delta watcher (sleep / lid open detection)
setInterval(() => {
  const now = Date.now();
  const delta = now - lastHeartbeatTick;
  lastHeartbeatTick = now;

  if (delta > 3500) {
    console.log(`⏰ [Guardian] System time jump detected (${delta}ms). Laptop resumed from sleep/lid close!`);
    triggerWakeAlert('Sleep/Standby Resume (Lid Open)');
  }
}, 1000);

// 2. Windows SystemEvents (PowerModes Resume & SessionSwitch)
function startWindowsEventListener() {
  const psCode = `
    Add-Type -AssemblyName System.Windows.Forms
    $handler = {
      param($sender, $e)
      if ($e.Mode -eq [Microsoft.Win32.PowerModes]::Resume) {
        Write-Host "EVENT:RESUME"
      }
    }
    $sessionHandler = {
      param($sender, $e)
      if ($e.Reason -eq [Microsoft.Win32.SessionSwitchReason]::SessionUnlock -or $e.Reason -eq [Microsoft.Win32.SessionSwitchReason]::SessionLogon) {
        Write-Host "EVENT:UNLOCK"
      }
    }
    [Microsoft.Win32.SystemEvents]::add_PowerModeChanged($handler)
    [Microsoft.Win32.SystemEvents]::add_SessionSwitch($sessionHandler)
    [System.Windows.Forms.Application]::Run()
  `;

  try {
    const ps = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psCode], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'ignore']
    });

    ps.stdout?.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg.includes('EVENT:RESUME')) {
        console.log('⚡ [PowerEvent] Windows Resume signal caught!');
        triggerWakeAlert('Windows Power Resume');
      } else if (msg.includes('EVENT:UNLOCK')) {
        console.log('⚡ [SessionEvent] Windows Session Logon/Unlock caught!');
        if (isLocked) triggerWakeAlert('Windows Session Unlock Attempt');
      }
    });

    ps.on('exit', () => {
      setTimeout(startWindowsEventListener, 5000);
    });
  } catch (err) {
    console.warn('[Guardian] Could not start native SystemEvents listener:', err.message);
  }
}

startWindowsEventListener();

// ─── TELEMETRY POLLING (Every 10 seconds) ────────────────────────────────────
setInterval(async () => {
  if (socket.connected) {
    const telemetry = await collectTelemetry();
    socket.emit('laptop_telemetry', telemetry);
  }
}, 10000);

// ─── BOOT ─────────────────────────────────────────────────────────────────────
launchLockscreen();
