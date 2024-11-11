const Ultimate = require("ultimate-nsfw");
const nsfw = Ultimate.default;

const possibleCategories = [
  "anal",
  "ass",
  "boobs",
  "doujin",
  "ero",
  "ecchi",
  "feet",
  "fourk",
  "gonewild",
  "hentai",
  "hboobs",
  "hass",
  "hthigh",
  "hmidriff",
  "kitsune",
  "lewd",
  "lewdneko",
  "milf",
  "neko",
  "paizuri",
  "pussy",
  "tentacle",
  "thigh",
  "waifu",
  "wallpaper",
  "yuri",
];

async function discoverCategories() {
  const validCategories = [];

  for (const category of possibleCategories) {
    try {
      const image = await nsfw.fetch(category); // Dynamically fetch each category
      validCategories.push(category); // If successful, add to valid categories
      console.log(`${category} is a valid category.`);
    } catch (error) {
      console.log(`${category} is not supported.`);
    }
  }

  console.log("Valid Categories:", validCategories);
}

discoverCategories();
