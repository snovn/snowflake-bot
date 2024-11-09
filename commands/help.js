const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of available commands"),

  async execute(interaction) {
    await interaction.reply({
      content:
        "Available commands:\n/help - Shows this message\n/ping - Checks bot latency",
      ephemeral: true,
    });
  },
};
