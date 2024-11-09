const { SlashCommandBuilder } = require("discord.js");
const { isPrivilegedUser } = require("../permissions"); // Import the permission check

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Replies with Pong and shows latency for privileged users!"
    ),

  async execute(interaction) {
    if (isPrivilegedUser(interaction.user.id)) {
      // If the user is privileged, show latency
      const latency = Math.round(interaction.client.ws.ping);
      await interaction.reply(`Pong! 🏓 Latency: ${latency}ms`);
    } else {
      // If the user is not privileged, send the standard response
      await interaction.reply("Pong! 🏓");
    }
  },
};
