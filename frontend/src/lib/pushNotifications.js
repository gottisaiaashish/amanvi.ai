import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const setupPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications are only available on native platforms');
    return;
  }

  // Request permission to use push notifications
  // iOS will prompt user and return if they granted permission or not
  // Android will just grant without prompting
  const { receive } = await PushNotifications.requestPermissions();

  if (receive === 'granted') {
    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();
  } else {
    console.warn('Push notification permission denied');
  }

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    
    try {
      // Send the token to the backend
      const response = await fetch('https://amanvi-ai.onrender.com/api/users/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'ashish@amanvi.ai', // Default user for now
          token: token.value
        })
      });
      console.log('Token saved to backend:', await response.json());
    } catch (err) {
      console.error('Failed to send token to backend:', err);
    }
  });

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError', (error) => {
    console.error('Error on registration: ' + JSON.stringify(error));
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ' + JSON.stringify(notification));
  });

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ' + JSON.stringify(notification));
  });
};
