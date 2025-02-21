import { sendLineMessage } from "../../utils/lineApi";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
    }

    try {
        await sendLineMessage(to, message);

        return res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("LINE API Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to send message" });
    }
}