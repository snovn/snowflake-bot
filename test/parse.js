const tik = require("rahad-media-downloader");

const tiktokUrl = "https://www.tiktok.com/@bakuvfx/video/7414425808401452320";

async function main() {
  try {
    const result = await tik.rahadtikdl(tiktokUrl);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
