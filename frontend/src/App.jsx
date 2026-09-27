import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import BrightLayout from './layouts/BrightLayout';
import UnifiedInbox from './pages/UnifiedInbox';
import DailySchedule from './pages/DailySchedule';
import AmanviSecretary from './pages/AmanviSecretary';
import LaptopSentinel from './pages/LaptopSentinel';
import { setupPushNotifications } from './lib/pushNotifications';

// Placeholder for settings
const SettingsView = () => <div className="p-12 text-gray-500">Settings Configuration for n8n Webhooks...</div>;

// Utility function to play an attention-grabbing alert chime via Web Audio API
const playAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.25);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.warn('Audio chime error:', e);
  }
};

function App() {
  useEffect(() => {
    setupPushNotifications();

    // Auto-request web notification permission if in browser
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const serverUrl = localStorage.getItem('amanvi_server_url') || 'https://unzip-trance-backup.ngrok-free.dev';

    // Global background Sentinel Socket for Instant Device Notifications
    const socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1500,
      extraHeaders: { 'ngrok-skip-browser-warning': '69420' }
    });

    let lastNotificationTime = 0;

    socket.on('laptop_boot_alert', async (data) => {
      const now = Date.now();
      // Debounce: prevent duplicate notification if received within 4 seconds
      if (now - lastNotificationTime < 4000) return;
      lastNotificationTime = now;

      console.log('🚨 [Global App Sentinel Alert Received]:', data);

      // 1. Play alert sound & vibration
      playAlertSound();
      if ('vibrate' in navigator) {
        try { navigator.vibrate([300, 150, 300]); } catch (e) {}
      }

      const alertTitle = '🚨 Alert: Laptop Lid Opened / Powered ON!';
      const alertBody = `Laptop ${data?.state?.deviceName || data?.hostname || 'Primary Laptop'} was opened. Tap to Face Unlock.`;

      // 2. Capacitor native notification (Android APK)
      try {
        if (Capacitor.isNativePlatform()) {
          await LocalNotifications.requestPermissions();
          await LocalNotifications.schedule({
            notifications: [
              {
                title: alertTitle,
                body: alertBody,
                id: 101,
                sound: 'default'
              }
            ]
          });
        }
      } catch (e) {
        console.warn('Local notification error:', e);
      }

      // 3. Web Notification (Mobile Chrome / PWA / Desktop browser)
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(alertTitle, {
            body: alertBody,
            icon: '/favicon.ico',
            requireInteraction: true
          });
        }
      } catch (e) {
        console.warn('Web notification error:', e);
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Router>
      <BrightLayout>
        <Routes>
          <Route path="/" element={<UnifiedInbox />} />
          <Route path="/schedule" element={<DailySchedule />} />
          <Route path="/amanvi" element={<AmanviSecretary />} />
          <Route path="/sentinel" element={<LaptopSentinel />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrightLayout>
    </Router>
  );
}

export default App;
