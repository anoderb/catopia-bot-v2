const fs = require("fs").promises;
const path = require("path");
const { configDotenv } = require("dotenv");
configDotenv();

const configPath = path.join(__dirname, "../configs/config.json");

exports.getTokens = async () => {
  try {
    // Memastikan file config.json ada
    const data = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(data);

    // Memastikan format token adalah array
    if (!Array.isArray(config.tokens)) {
      throw new Error("Invalid tokens format in config file");
    }

    // Menampilkan setiap token beserta jumlahnya
    config.tokens.map((item, index) => {
      console.log(`\n[ Token ${index + 1} ] : ${item.name} ${item.token}`);
    });
    console.log(`[ Total tokens ] : ${config.tokens.length}`);

    return config.tokens;
  } catch (error) {
    // Menangani error jika file tidak ditemukan atau token tidak ada
    console.log(
      `[ Error ] : ${error.message || "Token not found, please add token on configs/config.json"}`
    );
    return null;
  }
};
