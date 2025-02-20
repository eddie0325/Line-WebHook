import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { to, message } = req.body;
    const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

    if (!LINE_ACCESS_TOKEN) {
        return res.status(500).json({ error: "Server misconfiguration" });
    }

    if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
    }

    try {
        await axios.post("https://api.line.me/v2/bot/message/push", {
            to: to,
            messages: [{ type: "text", text: message }]
        }, {
            headers: {
                "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        return res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("LINE API Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to send message" });
    }
}