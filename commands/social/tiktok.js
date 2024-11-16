const { SlashCommandBuilder } = require("discord.js");
const tik = require("rahad-media-downloader");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tiktok")
    .setDescription("Download TikTok video without watermark.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The TikTok video URL")
        .setRequired(true)
    ),

  async execute(interaction) {
    // Defer the reply to allow time for the API request
    await interaction.deferReply();

    const tiktokUrl = interaction.options.getString("url");

    try {
      const result = await tik.rahadtikdl(tiktokUrl);

      if (result?.data?.noWatermarkMp4) {
        await interaction.editReply({
          content: `Here is your video without a watermark: ${result.data.noWatermarkMp4}`,
        });
      } else {
        await interaction.editReply({
          content:
            "Sorry, I couldn't fetch the video. Please check the URL and try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      await interaction.editReply({
        content:
          "An error occurred while processing your request. Please try again later.",
      });
    }
  },
};
