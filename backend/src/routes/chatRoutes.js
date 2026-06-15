import express from 'express';
import fetch from 'node-fetch'; // Requires node-fetch or native fetch in Node 18+

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, email } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Use env var or default to the new ngrok URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://unzip-trance-backup.ngrok-free.dev/webhook/amanvi-chat';
    
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
      let jsonData = JSON.parse(data);
      
      // n8n returns an array of items by default, so get the first item if it's an array
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        jsonData = jsonData[0];
      }

      if (jsonData && jsonData.reply) {
        replyText = jsonData.reply;
      } else if (jsonData && jsonData.output) {
        replyText = jsonData.output;
      } else if (jsonData && jsonData.text) {
        replyText = jsonData.text;
      } else {
        // Fallback: Just convert the whole JSON to string so we can see what it returned
        replyText = typeof jsonData === 'object' ? JSON.stringify(jsonData) : String(jsonData);
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
