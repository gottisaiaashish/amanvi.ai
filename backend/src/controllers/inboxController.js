import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inboxFilePath = path.join(__dirname, '../data/inbox.json');

// Helper to read messages
const readMessages = () => {
    try {
        const data = fs.readFileSync(inboxFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading inbox.json:", error);
        return [];
    }
};

// Helper to write messages
const writeMessages = (messages) => {
    try {
        fs.writeFileSync(inboxFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing to inbox.json:", error);
    }
};

export const getMessages = (req, res) => {
    const messages = readMessages();
    res.status(200).json(messages);
};

export const addMessage = (req, res) => {
    const { sender, message, urgency } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const messages = readMessages();
    
    const newMessage = {
        id: Date.now().toString(),
        sender: sender || "Unknown",
        message: message,
        urgency: urgency || "normal", // "high" or "normal"
        timestamp: new Date().toISOString(),
        read: false
    };

    messages.unshift(newMessage); // Add to top
    writeMessages(messages);

    res.status(201).json({ success: true, message: "Added to inbox successfully", data: newMessage });
};
