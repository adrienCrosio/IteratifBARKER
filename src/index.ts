import { Bot } from "./binance";
function main(): Bot | null {
    // return new Bot();

    return null;
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
    let bot = main();
    process.on("SIGINT", function () {
        console.log("ctr+C catch");
        bot?.clean();
        //graceful shutdown
        process.exit();
    });
}

function generateRandomArrayDuration() {

}

function calcMacd(arrayMoy, duration_min: number) {

}

export { main };