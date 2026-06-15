import { Router } from 'express';
import Message from '../models/Message.js';

const router = Router();

// @route   POST /api/webhooks/n8n
// @desc    Receive webhooks from n8n automations
router.post('/n8n', async (req, res) => {
  try {
    // Expected payload from n8n
    const { source, sender, content } = req.body;

    if (!source || !sender || !content) {
      res.status(400).json({ error: 'Missing required fields: source, sender, content' });
      return;
    }

    // Save to database
    const newMessage = new Message({
      source,
      sender,
      content,
      status: 'Unread'
    });

    await newMessage.save();

    console.log(`[n8n Webhook] Received ${source} message from ${sender}`);

    // Trigger Push Notification
    try {
      const app = (await import('../config/firebase.js')).default;
      const { getMessaging } = await import('firebase-admin/messaging');

      if (app) {
        // Find any user with a token for now (since it's a single-user app for Ashish)
        const User = (await import('../models/User.js')).default;
        const userWithToken = await User.findOne({ fcmToken: { $exists: true, $ne: null } });
        
        if (userWithToken && userWithToken.fcmToken) {
          const payload = {
            notification: {
              title: `New ${source} message from ${sender}`,
              body: content.substring(0, 100) + (content.length > 100 ? '...' : '')
            },
            token: userWithToken.fcmToken
          };
          
          await getMessaging(app).send(payload);
          console.log('[Push Notification] Sent successfully to mobile!');
        }
      }
    } catch (pushError) {
      console.error('[Push Notification Error]:', pushError);
    }
    res.status(201).json({ success: true, message: 'Message saved successfully', data: newMessage });
  } catch (error) {
    console.error('[n8n Webhook Error]:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route   GET /api/messages
// @desc    Get all messages for the frontend Unified Inbox
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ receivedAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
