const { SlashCommandBuilder } = require("discord.js");
const config = require("../../../config.json");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hanal")
    .setDescription("Displays a NSFW hanal image."),

  async execute(interaction) {
    // Ensure the command is used in an NSFW channel
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    try {
      const response = await superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "hanal" });

      const imageUrl = response.body.message;

      const embed = {
        color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
        title: "Here's your NSFW hentai anal image",
        image: { url: imageUrl },
        footer: {
          text: `Requested by ${interaction.user.tag}`,
        },
        timestamp: new Date(),
      };

      // Send the embed with the fetched image
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching NSFW hanal image:", error);
      await interaction.reply(
        "Sorry, an error occurred while fetching the image."
      );
    }
  },
};
