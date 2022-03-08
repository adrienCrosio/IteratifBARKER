import { ArrayTime, ArrayTimePrice } from '../interface/bot_inner_interface';
import { Bot } from "./binance";
import data_json from "../data/30-10-2021-19h-0m-21s_duration_55.json"
import { AlgorithmHandler } from './AlgorithmHandler';
import { AlgorithmParent } from './algorithm/AlgorithmParent';
import { ExempleAlgo } from './algorithm/ExempleAlgo';
function main() {
    let algorithm_list: AlgorithmParent[] = [];
    algorithm_list.push(new ExempleAlgo());
    new AlgorithmHandler({ currency: "BTCUSDT", algorithm_list, time_frame: '1m' });

    // const bot = new Bot(false);
    // bot.initTopicValues("currentPrice", data_json.currentPrice);
    // // return bot;
    // const duration_min = 10;
    // const start_date = new Date(data_json.currentPrice[0].time);
    // // let rdm_array = generateRandomArrayTimePrice(duration_min, start_date);
    // const array_time_price: ArrayTimePrice[] = data_json.currentPrice.map(x => {
    //     return { time: x.time, value: parseFloat(x.value) }
    // });
    // // console.log(array_time_price[0].time - array_time_price[array_time_price.length - 1].time)
    // let MACD_values: ArrayTimePrice[] = [];
    // for (const value of array_time_price) {
    //     let start_date = new Date(value.time);
    //     let macd_value = calcMACD(array_time_price, duration_min, start_date);
    //     if (macd_value !== null) {
    //         MACD_values.push({ time: value.time, value: macd_value });
    //     }
    // }
    // bot.initTopicValues("macdValues", MACD_values);
    // console.log("done init !");
    // const MACD_values = calcMACD(array_time_price, duration_min, start_date);
    // bot.initTopicValues("macdValues", MACD_values);
    // return bot;
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
        // bot!.clean();
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
function calcMME(arrayPrice: ArrayTimePrice[], duration_min: number, start_date: Date = new Date()) {
    let somme: number = 0;
    let duration_ms = duration_min * 60 * 1000
    let filtered_array = arrayPrice.filter(x => {
        // console.log(x.time- start_date.getTime());
        return x.time <= start_date.getTime() && start_date.getTime() - x.time < duration_ms
    });
    // if (filtered_array.length < 100)
    if (filtered_array.length === 0) {
        // console.log("length 0");
        return null;
    }
    let effective_duration = filtered_array[filtered_array.length - 1].time - filtered_array[0].time;
    if (effective_duration < duration_ms * 0.85) {
        // console.count("not enough data");
        return null;
    }
    //@ts-ignore
    let last_elem: ArrayTimePrice = filtered_array.pop();
    for (const value of filtered_array) {
        somme = somme + value.value;
    }
    const offset = somme / filtered_array.length;
    const MME = offset * 0.91 + last_elem.value * 0.09;
    return MME;
}

function calcMACD(arrayPrice: ArrayTimePrice[], duration_min: number, start_date: Date = new Date()) {
    let big_mme = calcMME(arrayPrice, duration_min, start_date);
    let small_mme = calcMME(arrayPrice, duration_min / 2, start_date);
    if (big_mme === null || small_mme === null) {
        return null;
    }
    return small_mme - big_mme;
}

export { main };