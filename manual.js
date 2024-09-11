const readline = require("readline");
const { validateToken } = require("./func/CheckValidToken");
const { upgradeAnimal } = require("./func/upgrade");

// Membuat antarmuka readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi untuk menanyakan pertanyaan dan mengembalikan jawaban
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

(async () => {
  try {
    // Menampilkan pilihan awal
    console.log("1. Select account to start");
    console.log("2. Start all");
    const option = await askQuestion("Choose an option: ");

    // Mendapatkan token yang valid
    const tokens = await validateToken();

    let selectedTokens = [];

    if (option === "1") {
      console.log("\nAvailable accounts:");
      tokens.forEach((token, index) => {
        console.log(`${index + 1}. ${token.name}`);
      });

      const accountNumbers = await askQuestion(
        "\nEnter the account numbers separated by comma (e.g. 1,2,3) : "
      );

      if (accountNumbers.toLowerCase() === "all") {
        selectedTokens = tokens; // Menggunakan semua akun
      } else {
        const selectedIndexes = accountNumbers.split(",").map((num) => parseInt(num.trim(), 10) - 1);
        selectedTokens = selectedIndexes.map((index) => tokens[index]);
      }
    } else if (option === "2") {
      selectedTokens = tokens; // Memulai semua akun
    } else {
      console.log("Invalid option. Exiting...");
      rl.close();
      return;
    }

    const value = await askQuestion("Enter the number of boxes to buy [100]: ");
    const type = await askQuestion(
      "\n1. Dogecoin\n2. Shiba Inu\n3. Cat in a dog's world\n4. Coo Inu\n5. Slerf\n6. Myro\n7. Wen\n8. Mog\n9. Bonk\n10. Smog\n11. WIF\n12. Floki\n13. Brett\n14. Pope\n15. Bonk\nEnter the animal type number 1-15: "
    );

    // Menampilkan hasil input
    console.log(`\nTotal BOX: ${value}`);
    console.log(`Animal Type: ${type}`);

    // Menjalankan upgradeAnimal untuk token yang dipilih
    for (const token of selectedTokens) {
      await upgradeAnimal(value, type, token.token);
    }

    // Menutup readline interface
    rl.close();
  } catch (err) {
    console.error("Error:", err);
    rl.close();
  }
})();
