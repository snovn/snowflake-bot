const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// Recursive function to get all command files in subdirectories
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

// Get all command files from subdirectories
const commandFiles = getCommandFiles(path.join(__dirname, "commands"));

for (const file of commandFiles) {
  const command = require(file);
  client.commands.set(command.data.name, command); // Set each command in the collection
}

// Load event files
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
