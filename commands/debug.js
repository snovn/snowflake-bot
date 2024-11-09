const { SlashCommandBuilder } = require("discord.js");
const { isPrivilegedUser } = require("../permissions"); // Import the permission check
const os = require("os");
const { version } = require("process");
const { performance } = require("perf_hooks");
const config = require("../config.json"); // Import config.json

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription(
      "Shows detailed bot debugging information (only available to privileged users)."
    ),

  async execute(interaction) {
    if (!isPrivilegedUser(interaction.user.id)) {
      await interaction.reply(
        "You do not have permission to access debugging commands."
      );
      return;
    }

    // Basic bot information
    const botInfo = {
      username: interaction.client.user.username,
      id: interaction.client.user.id,
      avatarURL: interaction.client.user.displayAvatarURL(),
      createdAt: interaction.client.user.createdAt.toDateString(),
      status: interaction.client.user.presence?.status || "N/A",
      uptime: formatUptime(process.uptime()),
      activity:
        interaction.client.user.presence?.activities
          .map((activity) => `${activity.type}: ${activity.name}`)
          .join(", ") || "N/A",
      shardInfo: interaction.client.ws.shards.size
        ? `${interaction.client.ws.shards.size} shards`
        : "No sharding",
    };

    // Guild Info
    const guildInfo = {
      totalGuilds: interaction.client.guilds.cache.size,
      totalMembers: interaction.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
      totalChannels: interaction.client.channels.cache.size,
    };

    // System Info
    const systemInfo = {
      nodeVersion: version,
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: formatMemory(os.totalmem()),
      freeMemory: formatMemory(os.freemem()),
      cpu: `${os.cpus()[0].model} - ${os.cpus()[0].speed}MHz (Total ${
        os.cpus().length
      } Cores)`,
    };

    // Bot API Info
    const apiInfo = {
      websocketPing: interaction.client.ws.ping,
      apiLatency: Math.round(interaction.client.ws.ping), // This can be considered as API latency as well
    };

    // Memory and Event Loop Performance
    const memoryUsage = process.memoryUsage();
    const heapTotal = formatMemory(memoryUsage.heapTotal);
    const heapUsed = formatMemory(memoryUsage.heapUsed);
    const eventLoopDelay = performance.now();

    // System load info
    const systemLoad = os
      .loadavg()
      .map((load) => load.toFixed(2))
      .join(", "); // 1, 5, and 15 minute load averages

    // Get the bot's commands count
    const commandsRegistered =
      interaction.client.application.commands.cache.size;

    // Compile all the information in an embed
    const embed = {
      color: parseInt(config.botColor.replace("#", ""), 16) || 0x0099ff,
      title: config.botName + "'s Debug Information",
      thumbnail: {
        url: botInfo.avatarURL,
      },
      fields: [
        {
          name: "**Bot Information**",
          value: `
            **Username:** ${botInfo.username}
            **ID:** ${botInfo.id}
            **Created At:** ${botInfo.createdAt}
            **Status:** ${botInfo.status}
            **Uptime:** ${botInfo.uptime}
            **Activity:** ${botInfo.activity}
            **Sharding Info:** ${botInfo.shardInfo}
          `,
        },
        {
          name: "**Guild Information**",
          value: `
            **Total Guilds:** ${guildInfo.totalGuilds}
            **Total Members:** ${guildInfo.totalMembers}
            **Total Channels:** ${guildInfo.totalChannels}
          `,
        },
        {
          name: "**System Information**",
          value: `
            **Node.js Version:** ${systemInfo.nodeVersion}
            **Platform:** ${systemInfo.platform} (${systemInfo.arch})
            **Total Memory:** ${systemInfo.totalMemory}
            **Free Memory:** ${systemInfo.freeMemory}
            **CPU:** ${systemInfo.cpu}
            **System Load (1, 5, 15 min avg):** ${systemLoad}
          `,
        },
        {
          name: "**Bot API Information**",
          value: `
            **WebSocket Latency (Ping):** ${apiInfo.websocketPing}ms
            **API Latency:** ${apiInfo.apiLatency}ms
          `,
        },
        {
          name: "**Memory & Event Loop Performance**",
          value: `
            **Heap Total:** ${heapTotal}
            **Heap Used:** ${heapUsed}
            **Event Loop Delay (ms):** ${eventLoopDelay.toFixed(2)}
          `,
        },
        {
          name: "**Performance & Commands**",
          value: `
            **Registered Commands:** ${commandsRegistered}
          `,
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.tag}`,
      },
      timestamp: new Date(),
    };

    // Send the debug information as an embedded message
    await interaction.reply({ embeds: [embed] });
  },
};

// Helper functions to format uptime, memory, etc.
function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secondsRemaining}s`;
}

function formatMemory(bytes) {
  const mb = bytes / (1024 * 1024); // Convert bytes to MB
  return `${mb.toFixed(2)} MB`;
}
