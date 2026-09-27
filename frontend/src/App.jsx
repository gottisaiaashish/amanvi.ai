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

function App() {
  useEffect(() => {
    setupPushNotifications();

    // Global background Sentinel Socket for Instant Android Device Notifications
    const socket = io('https://unzip-trance-backup.ngrok-free.dev', {
      reconnection: true,
      extraHeaders: { 'ngrok-skip-browser-warning': '69420' }
    });

    let lastNotificationTime = 0;

    socket.on('laptop_boot_alert', async (data) => {
      const now = Date.now();
      // Debounce: prevent duplicate notification if received within 5 seconds
      if (now - lastNotificationTime < 5000) return;
      lastNotificationTime = now;

      try {
        if (Capacitor.isNativePlatform()) {
          await LocalNotifications.requestPermissions();
          await LocalNotifications.schedule({
            notifications: [
              {
                title: '🚨 Alert: Laptop Powered ON!',
                body: `Laptop ${data?.state?.deviceName || 'gottiaashish'} started. Open Amanvi AI for Face Unlock.`,
                id: 101, // Single fixed ID so it never duplicates
                sound: 'default'
              }
            ]
          });
        }
      } catch (e) {}
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
