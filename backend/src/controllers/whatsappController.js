import { sendWhatsAppMessage } from '../services/whatsappService.js';

export const sendMessage = async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: "Missing 'to' or 'message' in request body." });
        }

        const response = await sendWhatsAppMessage(to, message);
        
        res.status(200).json({
            success: true,
            info: "Message sent successfully",
            data: response.id._serialized
        });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
