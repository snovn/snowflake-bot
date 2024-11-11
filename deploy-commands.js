require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];

// Function to recursively get all command files in subdirectories
function getCommandFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let jsFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      jsFiles = jsFiles.concat(getCommandFiles(filePath)); // Recursively add files from subfolders
    } else if (file.isFile() && file.name.endsWith(".js")) {
      jsFiles.push(filePath);
    }
  }

  return jsFiles;
}

const commandFiles = getCommandFiles(path.join(__dirname, "commands"));

for (const file of commandFiles) {
  const command = require(file);

  // Convert command data to JSON and add custom properties
  const commandData = command.data.toJSON();
  commandData.integration_types = [0, 1]; // 0 = Servers, 1 = DMs & everywhere
  commandData.contexts = [0, 1, 2]; // 0 = Servers, 1 = DMs, 2 = Group chats

  commands.push(commandData);
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing global application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded global application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
