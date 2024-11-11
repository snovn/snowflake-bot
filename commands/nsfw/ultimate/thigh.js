const { SlashCommandBuilder } = require("discord.js");
const Ultimate = require("ultimate-nsfw");
const nsfw = Ultimate.default;
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("thigh")
    .setDescription("Displays a NSFW thigh image."),

  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    try {
      const image = await nsfw.fetch("thigh"); // Use the package method

      const embed = {
        color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
        title: "Here's your thigh image",
        image: { url: image.url },
        footer: {
          text: `Requested by ${interaction.user.tag}`,
        },
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Sorry, an error occurred while fetching the image."
      );
    }
  },
};