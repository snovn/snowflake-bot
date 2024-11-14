const { SlashCommandBuilder } = require("discord.js");
const { wantnekonsfw } = require("wantnsfwapi"); // Import the wantnsfwapi package
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("phgif")
    .setDescription("Displays a NSFW porn gif."),

  async execute(interaction) {
    // Ensure the command is used in an NSFW channel
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    try {
      // Use the wantblowjobx method to fetch an image
      const imageURL = await wantnekonsfw.wantnekopgif();

      const embed = {
        color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
        title: "Here's your NSFW porn gif",
        image: { url: imageURL },
        footer: {
          text: `Requested by ${interaction.user.tag}`,
        },
        timestamp: new Date(),
      };

      // Send the embed with the fetched image
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching NSFW blowjob image:", error);
      await interaction.reply(
        "Sorry, an error occurred while fetching the image."
      );
    }
  },
};