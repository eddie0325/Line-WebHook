import { sendLineMessage } from "../../utils/lineApi";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    console.log("📩 Receive Webhook:", JSON.stringify(req.body, null, 2));

    if (req.body.events.length > 0) {
        const event = req.body.events[0];

        // #region event: join

        // When joining a group, send the group ID.
        if (event.type === "join" && event.source.type === "group") {
            const groupId = event.source.groupId;
            console.log("🎯 Bot joined group ID:", groupId);

            await sendLineMessage(groupId, `This group's ID is: ${groupId}`);
            return res.json({ status: "ok" });
        }
        // #endregion

        // #region event: message

        // When someone in the group sends "/groupid", return the group ID
        if (event.type === "message" && event.message.text === "/groupid") {
            const groupId = event.source.groupId;

            await sendLineMessage(groupId, `This group's ID is: ${groupId}`);
            return res.json({ status: "ok" });
        }
        // #endregion
    }

    res.json({ status: "no action" });
}
