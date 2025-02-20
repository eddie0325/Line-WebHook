import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    console.log("📩 Receive Webhook:", JSON.stringify(req.body, null, 2));

    const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

    if (!LINE_ACCESS_TOKEN) {
        console.error("❌ Variable LINE_ACCESS_TOKEN is not set.");
        return res.status(500).json({ error: "Server misconfiguration" });
    }

    if (req.body.events.length > 0) {
        const event = req.body.events[0];

        // join a group
        if (event.type === "join" && event.source.type === "group") {
            const groupId = event.source.groupId;
            console.log("🎯 group ID:", groupId);

            await axios.post("https://api.line.me/v2/bot/message/push", {
                to: groupId,
                messages: [{ type: "text", text: `group ID is: ${groupId}` }]
            }, {
                headers: {
                    "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            return res.json({ status: "ok" });
        }

        // message == "/groupid"
        if (event.type === "message" && event.message.text === "/groupid") {
            const groupId = event.source.groupId;

            await axios.post("https://api.line.me/v2/bot/message/push", {
                to: groupId,
                messages: [{ type: "text", text: `group ID is: ${groupId}` }]
            }, {
                headers: {
                    "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            return res.json({ status: "ok" });
        }
    }

    res.json({ status: "no action" });
}
