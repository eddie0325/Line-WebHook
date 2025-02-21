import axios from "axios";

// Retrieve LINE Channel Access Token from environment variables
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

if (!LINE_ACCESS_TOKEN) {
    throw new Error("❌ LINE_ACCESS_TOKEN is not set. Please configure it in Vercel environment variables.");
}

// 🔹 Common function: Send a message to a LINE group or user
export async function sendLineMessage(to, message) {
    if (!to || !message) {
        throw new Error("❌ 'to' and 'message' parameters cannot be empty.");
    }

    try {
        const response = await axios.post("https://api.line.me/v2/bot/message/push", {
            to,
            messages: [{ type: "text", text: message }]
        }, {
            headers: {
                "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`✅ Message sent to ${to}: ${message}`);
        return response.data;

    } catch (error) {
        console.error("❌ Failed to send LINE message:", error.response?.data || error.message);
        throw new Error("❌ Failed to send LINE message");
    }
}