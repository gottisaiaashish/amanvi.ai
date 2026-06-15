import express from 'express';
import fetch from 'node-fetch'; // Requires node-fetch or native fetch in Node 18+

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, email } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    // If n8n webhook isn't configured yet, just return a success placeholder
    if (!n8nWebhookUrl) {
      console.log(`[Chat Received] User: ${email || 'Unknown'} | Message: ${message}`);
      return res.json({ 
        success: true, 
        reply: "I am ready to connect to n8n. Please add N8N_WEBHOOK_URL to Render." 
      });
    }

    // Forward the chat message to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'ashish@amanvi.ai',
        message: message,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }

    // Usually n8n will process it asynchronously and send a webhook back,
    // but if it responds immediately, we can parse it here.
    const data = await response.text();
    let replyText = "Message forwarded to Amanvi AI Brain (n8n).";
    
    try {
      const jsonData = JSON.parse(data);
      if (jsonData && jsonData.reply) {
        replyText = jsonData.reply;
      }
    } catch(e) {
      // Not JSON, ignore
    }

    res.json({ success: true, reply: replyText });

  } catch (error) {
    console.error('Error forwarding chat to n8n:', error);
    res.status(500).json({ success: false, message: 'Failed to communicate with AI Brain', error: error.message });
  }
});

export default router;
