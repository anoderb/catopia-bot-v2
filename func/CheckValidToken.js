const { default: axios } = require("axios");
const { getTokens } = require("./GetTokens");
const { configDotenv } = require("dotenv");
configDotenv();

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString(); // Format waktu sesuai dengan format lokal
}

exports.validateToken = async () => {
  const tokens = await getTokens();
  
  // Pastikan tokens adalah array
  if (!Array.isArray(tokens)) {
    throw new Error("Tokens is not an array");
  }

  if (tokens.length === 0) {
    console.log("Token not found, please add token on configs/config.json");
    return []; // Kembalikan array kosong jika tidak ada token
  }

  const validToken = [];
  for (const token of tokens) {
    try {
      await axios.get("https://api.catopia.io/api/v1/user/me?limit=3000", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      validToken.push(token);
    } catch (error) {
      console.log(`[ ${getCurrentTime()} ][ Error ] :${token.name} token not valid , response code : ${error.response ? error.response.status : error.message}`);
    }
  }
  console.log(`[ ${getCurrentTime()} ][ Token valid ] : ${validToken.length}\n`);
  return validToken;
};
