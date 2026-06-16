import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

let client = null;

export const initializeWhatsApp = () => {
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('====================================');
        console.log('SCAN THIS QR CODE WITH WHATSAPP APP:');
        console.log('====================================');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp Client is ready and connected!');
    });

    client.on('message', async msg => {
        // Ignore status updates
        if (msg.isStatus) return;

        console.log(`📥 Received message from ${msg.from}: ${msg.body}`);
        
        // Forward message to n8n Webhook
        try {
            // Change this URL to your actual n8n webhook URL for processing incoming messages
            const webhookUrl = process.env.N8N_WHATSAPP_WEBHOOK || 'https://unzip-trance-backup.ngrok-free.dev/webhook-test/whatsapp-incoming';
            
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: msg.id.id,
                    from: msg.from, // Format: 919876543210@c.us
                    body: msg.body,
                    senderName: msg._data.notifyName || 'Unknown',
                    timestamp: msg.timestamp
                })
            });
            console.log('✅ Message forwarded to n8n webhook.');
        } catch (error) {
            console.error('❌ Failed to forward message to n8n:', error.message);
        }
    });

    client.initialize();
};

export const sendWhatsAppMessage = async (to, message) => {
    if (!client) {
        throw new Error('WhatsApp client is not initialized or ready yet.');
    }
    
    // The 'to' number must end with @c.us for regular contacts
    let formattedNumber = to;
    if (!formattedNumber.includes('@')) {
        // Assuming pure number string, append @c.us
        // Ensure to remove any '+' sign if provided by n8n
        formattedNumber = `${formattedNumber.replace('+', '')}@c.us`;
    }
    
    return await client.sendMessage(formattedNumber, message);
};
