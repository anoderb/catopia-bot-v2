const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString(); // Format waktu sesuai dengan format lokal
}


exports.claimMission = async () => {
  const tokens = await validateToken();

  for (const token of tokens) {
    try {
      const mission = await axios
        .get("https://api.catopia.io/api/v1/user/daily-mission?limit=3000", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        })
        .then((res) => res.data.data);
      const availableClaim = mission.filter(
        (m) => m.isCompleted === true && m.claimed === false
      );
      console.log(availableClaim);
      if (availableClaim.length > 0) {
        for (const claim of availableClaim) {
          await axios.post(
            `https://api.catopia.io/api/v1/user/daily-mission/${claim.id}/claim`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.token}`,
              },
            }
          );
          console.log(`[ ${getCurrentTime()} ][ Claimed ] : ${token.name} Mission ID ${claim.id} Claimed`);
        }
      } else {
        console.log(`[ ${getCurrentTime()} ][ Completed ] : ${token.name} No available mission to claim`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};
