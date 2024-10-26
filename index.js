const { main } = require("./script");

(async () => {
    try {
        await main();
        console.log("Automation completed successfully!");
    } catch (err) {
        console.error("Error during automation:", err);
    }
})();
