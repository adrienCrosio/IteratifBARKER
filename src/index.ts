import { ArrayTime, ArrayTimePrice } from '../interface/bot_inner_interface';
import { Bot } from "./binance";

function main(): Bot {
    return new Bot();
    // const duration_min = 10;
    // const start_date = new Date();
    // let rdm_array = generateRandomArrayTimePrice(duration_min, start_date);
    // console.log(calcMACD(rdm_array, duration_min, start_date));
    // return new Bot(false);
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
        bot!.clean();
        //graceful shutdown
        process.exit();
    });
}

function generateRandomArrayTimePrice(duration_min: number, start_date: Date = new Date()): ArrayTimePrice[] {
    let result: ArrayTimePrice[] = [];
    let tmp_date = start_date.getTime();
    let nb_index = Math.round(60 * duration_min); // one number per second
    for (let index = 0; index < nb_index; index++) {
        const date = tmp_date - (index * 1000);
        result.unshift({
            time: date,
            value: Math.random()
        });
    }
    return result;
}

/**
 * Take ordered by time value and return the MME (Moyenne Mobile Exponentiel) used for MACD
 * @param arrayMoy 
 * @param duration_min 
 * @param start_date 
 */
function calcMME(arrayMoy: ArrayTimePrice[], duration_min: number, start_date: Date = new Date()) {
    let somme: number = 0;
    let filtered_array = arrayMoy.filter(x => x.time < start_date.getTime() - duration_min * 1000);
    //@ts-ignore
    let last_elem: ArrayTimePrice = filtered_array.pop();
    for (const value of filtered_array) {
        somme = somme + value.value;
    }
    const offset = somme / filtered_array.length;
    const MME = offset * 0.91 + last_elem.value * 0.09;
    return MME;
}

function calcMACD(arrayMoy: ArrayTimePrice[], duration_min: number, start_date: Date = new Date()) {
    return calcMME(arrayMoy, duration_min / 2, start_date) - calcMME(arrayMoy, duration_min, start_date);
}

export { main };