const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { real_search } = require("r34-module");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("real")
    .setDescription("Fetch NSFW media from Realbooru")
    .addStringOption((option) =>
      option.setName("tag").setDescription("Tag to search").setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      await interaction.reply(
        "This command can only be used in NSFW channels."
      );
      return;
    }

    await interaction.channel.fetch();

    const tag = interaction.options.getString("tag");

    try {
      const images = await real_search({ search_tag: tag, gay_block: false });

      // Check for status: 400 (invalid tag) or empty results
      if (images.status === 400) {
        await interaction.reply(
          `Invalid tag provided: "${tag}". Please try a different one.`
        );
        return;
      }

      if (!images || images.length === 0) {
        await interaction.reply("No results found for the specified tag.");
        return;
      }

      let currentIndex = 0;

      const generateMessage = (index) => {
        return (
          `Here's your Realbooru media for "${tag}" (Showing ${index + 1} of ${
            images.length
          })\n` + `-# [Click to Open Source](${images[index]})\n\n`
        );
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentIndex === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentIndex === images.length - 1)
      );

      const message = await interaction.reply({
        content: generateMessage(currentIndex),
        components: [row],
        fetchReply: true,
      });

      const collector = message.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000, // 1 minute
      });

      collector.on("collect", async (buttonInteraction) => {
        if (buttonInteraction.customId === "next") {
          currentIndex++;
        } else if (buttonInteraction.customId === "previous") {
          currentIndex--;
        }

        await buttonInteraction.update({
          content: generateMessage(currentIndex),
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentIndex === 0),
              new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentIndex === images.length - 1)
            ),
          ],
        });
      });

      collector.on("end", async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );
        await message.edit({ components: [disabledRow] });
      });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Sorry, an error occurred while fetching the image."
      );
    }
  },
};
