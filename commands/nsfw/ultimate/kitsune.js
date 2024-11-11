const { SlashCommandBuilder } = require("discord.js");
const Ultimate = require("ultimate-nsfw");
const nsfw = Ultimate.default;
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kitsune")
    .setDescription("Displays a NSFW kitsune image."),

  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    try {
      const image = await nsfw.fetch("kitsune"); // Use the package method

      const embed = {
        color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
        title: "Here's your kitsune image",
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
