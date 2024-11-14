const { SlashCommandBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hmeru")
    .setDescription("Displays a random NSFW meru image."),

  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    try {
      // Dynamically import the merunyaa.xyz module
      const { random } = await import("merunyaa.xyz");

      // Fetch a random image using the random() method
      const images = await random();
      const image = images[0]; // Assuming the random() method returns an array of images

      const embed = {
        color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
        title: "Here's your random hentai meru image",
        image: { url: image },
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
