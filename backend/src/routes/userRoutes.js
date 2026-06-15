import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// @route   POST /api/users/fcm-token
// @desc    Save the Firebase Cloud Messaging token for a user
router.post('/fcm-token', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      res.status(400).json({ error: 'Email and token are required' });
      return;
    }

    // Upsert user to save the token
    const user = await User.findOneAndUpdate(
      { email },
      { fcmToken: token, name: email.split('@')[0] }, // fallback name
      { new: true, upsert: true }
    );

    console.log(`[Push Token] Saved FCM token for user ${email}`);
    res.status(200).json({ success: true, message: 'Token saved successfully' });
  } catch (error) {
    console.error('[Push Token Error]:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
