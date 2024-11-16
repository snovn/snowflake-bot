const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    // Set the bot's activity
    client.user.setPresence({
      activities: [{ name: `discord.js v14`, type: ActivityType.Playing }],
      status: "online",
    });
  },
};
