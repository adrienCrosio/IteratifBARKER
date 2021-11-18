import { Bot } from "./binance";
function main(): Bot {
    return new Bot();
};

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        //@ts-ignore
        process.emit("SIGINT");
    });
}

if (require.main === module) {
    console.log('called directly');
    let bot = main();
    process.on("SIGINT", function () {
        console.log("ctr+C catch");
        bot.clean();
        //graceful shutdown
        process.exit();
    });
}

export { main };