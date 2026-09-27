import { Router } from 'express';
import {
  getLaptopState,
  unlockLaptopFromApi,
  lockLaptopFromApi,
  sendCustomCommand,
  triggerTestBootAlert,
  registerFcmToken
} from '../services/sentinelService.js';
import User from '../models/User.js';

const router = Router();

// @route   POST /api/sentinel/test-alert
// @desc    Trigger test boot notification & alert modal
router.post('/test-alert', async (req, res) => {
  try {
    const result = await triggerTestBootAlert();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/sentinel/status
// @desc    Get current real-time laptop status & telemetry
router.get('/status', (req, res) => {
  try {
    const state = getLaptopState();
    res.json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/sentinel/unlock
// @desc    Unlock laptop after mobile biometric/face verification
router.post('/unlock', (req, res) => {
  try {
    const { authMethod } = req.body;
    const state = unlockLaptopFromApi(authMethod || 'Mobile Face ID');
    res.json({ success: true, message: 'Laptop unlock signal sent', data: state });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/sentinel/lock
// @desc    Remotely lock laptop
router.post('/lock', (req, res) => {
  try {
    const state = lockLaptopFromApi();
    res.json({ success: true, message: 'Laptop lock signal sent', data: state });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/sentinel/command
// @desc    Send custom action (e.g., snapshot, alarm, sleep, shutdown)
router.post('/command', (req, res) => {
  try {
    const { action, payload } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, error: 'Action is required' });
    }
    const result = sendCustomCommand(action, payload);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/sentinel/register-token
// @desc    Register or update FCM push token for mobile app
router.post('/register-token', async (req, res) => {
  try {
    const { fcmToken, email } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ success: false, error: 'fcmToken is required' });
    }

    let user = email ? await User.findOne({ email }) : await User.findOne({});
    if (!user) {
      user = await User.create({
        email: email || 'ashish@amanvi.ai',
        name: 'Ashish',
        fcmToken
      });
    } else {
      user.fcmToken = fcmToken;
      await user.save();
    }

    console.log('[Sentinel] FCM Token registered:', fcmToken.substring(0, 20) + '...');
    res.json({ success: true, message: 'FCM token registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

