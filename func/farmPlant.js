const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");
const { getLand, getPlantInfo, harvestPlant } = require("./repo");
const { buyPlant } = require("./buyPlant");

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];  // Format HH:MM:SS
}

exports.farmPlant = async () => {
  const tokens = await validateToken();

  for (const token of tokens) {
    const harvest = await harvestPlant(token);

    if (harvest?.gold) {
      console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ Running ] : GOLD: ${harvest.gold} Harvested from Land`);

      const land = await getLand(token);
      if (!land) {
        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Can't get land info ${token.token}`);
      } else if (land.emptyLand.length === 0) {
        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : No empty land ${token.token}`);
      } else {
        const plant = await getPlantInfo(token);
        if (!plant) {
          console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Can't get plant info ${token.token}`);
        } else if (plant.length < land.emptyLand.length) {
          for (const buy of land.emptyLand) {
            try {
              await buyPlant();
              console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Buy Plant ...`);
            } catch (error) {
              console.log(error.message);
            }
          }
        }

        const checkUpdatePlant = await getPlantInfo(token);
        for (let i = 0; i < Math.min(land.emptyLand.length, 4); i++) {
          const farm = land.emptyLand[i];
          farm.checkUpdatePlant = checkUpdatePlant[i];

          try {
            await axios.post(
              `https://api.catopia.io/api/v1/players/plant`,
              {
                plantId: checkUpdatePlant[i].id,
                landId: farm.id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );

            console.log(
              `${checkUpdatePlant[i].id} planted to Land [ ${farm.id} ]`
            );
          } catch (error) {
            console.log(error.message);
          }
        }

        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Wait 10 minutes for Growing...`);
        await delay(10);

        const nextHarvest = await axios.post(
          "https://api.catopia.io/api/v1/players/plant/harvestAll",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        console.log(
          `[ ${getCurrentTime()} ][ Token ${token.name} ][ Running ] : GOLD: ${nextHarvest.data.data.gold} Harvested from Land`
        );
      }
    } else {
      console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : No harvestable plants.`);
      console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ Running ] : GOLD: ${harvest.gold} Harvested from Land`);

      const land = await getLand(token);
      if (!land) {
        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Can't get land info ${token.token}`);
      } else if (land.emptyLand.length === 0) {
        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : No empty land ${token.token}`);
      } else {
        const plant = await getPlantInfo(token);
        if (!plant) {
          console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Can't get plant info ${token.token}`);
        } else if (plant.length < land.emptyLand.length) {
          for (const buy of land.emptyLand) {
            try {
              await buyPlant();
              console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Buy Plant ...`);
            } catch (error) {
              console.log(error.message);
            }
          }
        }

        const checkUpdatePlant = await getPlantInfo(token);
        for (let i = 0; i < Math.min(land.emptyLand.length, 4); i++) {
          const farm = land.emptyLand[i];
          farm.checkUpdatePlant = checkUpdatePlant[i];

          try {
            await axios.post(
              `https://api.catopia.io/api/v1/players/plant`,
              {
                plantId: checkUpdatePlant[i].id,
                landId: farm.id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );

            console.log(
              `${checkUpdatePlant[i].id} planted to Land [ ${farm.id} ]`
            );
          } catch (error) {
            console.log(error.message);
          }
        }

        console.log(`[ ${getCurrentTime()} ][ Token ${token.name} ][ BOT ] : Wait 10 minutes for Growing...`);
        await delay(10);

        const nextHarvest = await axios.post(
          "https://api.catopia.io/api/v1/players/plant/harvestAll",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        console.log(
          `[ ${getCurrentTime()} ][ Token ${token.name} ][ Running ] : GOLD: ${nextHarvest.data.data.gold} Harvested from Land`
        );
      }
    }
  }
};

function delay(minutes) {
  return new Promise((resolve) => setTimeout(resolve, minutes * 60000));
}
