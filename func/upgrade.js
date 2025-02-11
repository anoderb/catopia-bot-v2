const { default: axios } = require("axios");
const { getUserInfo, formatNumber } = require("./repo");
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString(); // Format waktu sesuai dengan format lokal
}

exports.upgradeAnimal = async (value, type, token) => {
  try {
    // Mengambil data pet dengan token yang diberikan
    const getPet = await axios.get(
      "https://api.catopia.io/api/v1/players/pet?limit=3000",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = await getUserInfo({ token });
    const gold = user.goldenCoin || 0;

    const pet = getPet.data.totalRow;
    console.log(`[ ${getCurrentTime()} ] [ Total Pets : ${pet}/3000 ]`);
    console.log(`[ ${getCurrentTime()} ] [ GOLD : ${formatNumber(gold)} ]\n`);

    // Periksa apakah cukup emas atau ruang untuk membeli box
    if (Number(gold) > 500000 || Number(pet) <= 3000) {
      for (let index = 0; index < value; index++) {
        const buy = await axios.post(
          "https://api.catopia.io/api/v1/store/buy",
          {
            storeId: 4,
            price: 60000,
            unit: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const box = buy.data.data.buyData;
        console.log(
          `[ ${getCurrentTime()} ] [ BUY ] : buy box has been created : length : ${box.length} `
        );

        const openBox = await axios.post(
          "https://api.catopia.io/api/v1/chest/open-multiple",
          {
            petTypeIds: [type],
            chestIds: box.map((item) => item.id),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const boxReadyOpen = openBox.data.data.petsReceived;
        console.log(
          `[ ${getCurrentTime()} ] [ OPEN ] : open box has been created : length : ${boxReadyOpen.length} `
        );

        const upgrade = await axios.post(
          "https://api.catopia.io/api/v1/players/pet/fast-upgrade",
          {
            level: 1,
            petTypeId: Number(type),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(upgrade.data.data);
        console.log(`[ ${getCurrentTime()} ] [ UPGRADE ] : upgrade pets has been created.. `);
        console.log(`[ ${getCurrentTime()} ] [ BOT ] : wait 2 seconds...`);
        await delay(1);
        console.log(`[ ${getCurrentTime()} ][ BOT ] : Box ${index + 1} has been opened`);
      }

      console.log(`[ ${getCurrentTime()} ] [ BOT ] : buy animal done..`);
    } else {
      console.log(`[ ${getCurrentTime()} ] [ ERROR ] : You don't have enough gold or pet`);
    }
  } catch (error) {
    console.log(`[ ${token} ] [ ERROR ] : ${error.message}`);
  }
};

// Fungsi delay sederhana
function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
