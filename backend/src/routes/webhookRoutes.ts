import { Router, Request, Response } from 'express';
import Message from '../models/Message';

const router = Router();

// @route   POST /api/webhooks/n8n
// @desc    Receive webhooks from n8n automations
router.post('/n8n', async (req: Request, res: Response): Promise<void> => {
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
    res.status(201).json({ success: true, message: 'Message saved successfully', data: newMessage });
  } catch (error) {
    console.error('[n8n Webhook Error]:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route   GET /api/messages
// @desc    Get all messages for the frontend Unified Inbox
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ receivedAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;