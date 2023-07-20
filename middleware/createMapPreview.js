const axios = require("axios");
const sharp = require("sharp");

const createMapPreview = async (url) => {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = res.data;
    const bufferedImage = await sharp(buffer).resize(192, 192).toBuffer();
    const base64Image = bufferedImage.toString("base64");
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error creating map preview:", error);
    throw new Error("Failed to create map preview");
  }
};

module.exports = createMapPreview;
