const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config.json"); // Import config.json

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of available commands"),

  async execute(interaction) {
    const commands = interaction.client.commands;

    // Initialize categories
    const categories = {
      debug: [],
      nsfw: {
        booru: [],
        ultimate: [],
        wantapi: [],
      },
      other: [],
    };

    // Organize commands by category based on command names
    commands.forEach((command) => {
      if (!command || !command.data || !command.data.name) return; // Ensure command data is valid

      const commandName = command.data.name.toLowerCase();

      // Categorize commands manually based on names
      if (commandName === "debug") {
        categories.debug.push(command);
      } else if (["r34", "real", "safebooru"].includes(commandName)) {
        categories.nsfw.booru.push(command);
      } else if (
        [
          "anal",
          "ass",
          "boobs",
          "doujin",
          "ecchi",
          "ero",
          "feet",
          "fourk",
          "gonewild",
          "hass",
          "hboobs",
          "hmidriff",
          "hthigh",
          "lewd",
          "lewdneko",
          "milf",
          "neko",
          "paizuri",
          "pussy",
          "tentacle",
          "thigh",
          "waifu",
          "wallpaper",
        ].includes(commandName)
      ) {
        categories.nsfw.ultimate.push(command);
      } else if (
        [
          "hblowjob",
          "hcuck",
          "hmaster",
          "hmobile",
          "hneko",
          "hwaifu",
          "kitsune",
          "phgif",
          "yuri",
          "zettai",
        ].includes(commandName)
      ) {
        categories.nsfw.wantapi.push(command);
      } else {
        categories.other.push(command);
      }
    });

    // Create embed for each category
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

    // Add debug commands
    if (categories.debug.length > 0) {
      embed.fields.push({
        name: "Debug",
        value: categories.debug
          .map(
            (cmd) =>
              `/${cmd.data.name}: ${cmd.data.description || "No description"}`
          )
          .join("\n"),
      });
    }

    // Add nsfw categories
    if (categories.nsfw.booru.length > 0) {
      embed.fields.push({
        name: "NSFW - Booru",
        value: categories.nsfw.booru
          .map(
            (cmd) =>
              `/${cmd.data.name}: ${cmd.data.description || "No description"}`
          )
          .join("\n"),
      });
    }
    if (categories.nsfw.ultimate.length > 0) {
      embed.fields.push({
        name: "NSFW - Ultimate",
        value: categories.nsfw.ultimate
          .map(
            (cmd) =>
              `/${cmd.data.name}: ${cmd.data.description || "No description"}`
          )
          .join("\n"),
      });
    }
    if (categories.nsfw.wantapi.length > 0) {
      embed.fields.push({
        name: "NSFW - WantAPI",
        value: categories.nsfw.wantapi
          .map(
            (cmd) =>
              `/${cmd.data.name}: ${cmd.data.description || "No description"}`
          )
          .join("\n"),
      });
    }

    // Add other commands
    if (categories.other.length > 0) {
      embed.fields.push({
        name: "Other",
        value: categories.other
          .map(
            (cmd) =>
              `/${cmd.data.name}: ${cmd.data.description || "No description"}`
          )
          .join("\n"),
      });
    }

    // Send the help message
    await interaction.reply({ embeds: [embed] });
  },
};
