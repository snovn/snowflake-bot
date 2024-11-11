const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config.json"); // Import config.json

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of available commands"),

  async execute(interaction) {
    // Get all commands from the client
    const commands = interaction.client.commands;

    // Create a help embed
    const embed = {
      color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
      title: "Help - Available Commands",
      description: "Here is a list of all available commands for the bot:",
      fields: [],
      footer: {
        text: `Requested by ${interaction.user.tag}`,
      },
      timestamp: new Date(),
    };

    // Loop through all commands and add them to the embed fields
    commands.forEach((command) => {
      embed.fields.push({
        name: `/${command.data.name}`,
        value: command.data.description || "No description provided.",
      });
    });

    // If no commands are registered, show a message
    if (embed.fields.length === 0) {
      embed.description = "No commands have been registered yet.";
    }

    // Send the help message
    await interaction.reply({ embeds: [embed] });
  },
};
