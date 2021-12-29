import Binance, { BidDepth, ReconnectingWebSocketHandler } from 'binance-api-node';
import { ArrayTime } from '../interface/bot_inner_interface';
import api_key from "../apikey.json";
import { writeFile } from 'fs';

class Bot {
    private cleanList: ReconnectingWebSocketHandler[] = [];
    private allTopicCallBackFct!: (topic: string, value: any) => void;
    private allValueTopic: { [topic: string]: ArrayTime[] } = {};
    private duration: number = 6 * 60 * 60 * 1000; //6 h
    constructor(webInteraction: boolean = true) {
        if (webInteraction) {
            const client = Binance({
                apiKey: api_key.public_key,
                apiSecret: api_key.secret_key,
                getTime: () => Date.now()
            });
            const currency = 'ETHBTC'
            // let clean = client.ws.aggTrades(currency, (trad) => {
            //     console.log({ trad });
            // });

            this.cleanList.push(client.ws.depth(currency, (truc) => {
                let min_price = 99999999, max_price = 0, ask_value!: BidDepth, bid_value!: BidDepth;
                truc.askDepth.map((value) => {
                    let float = parseFloat(value.price);
                    if (min_price > float) {
                        ask_value = value;
                    }
                })
                truc.bidDepth.map((value) => {
                    let float = parseFloat(value.price);
                    if (max_price < float) {
                        bid_value = value;
                    }
                    // value.price
                })
                // console.log({ ask_value, bid_value });
                // let diff = ask_value.price - bid_value.price;
                // console.log(candle.close,candle.closeTime, Date.now());
                // candle.
                // this.pub('currentPrice', candle.close);
            }));

            this.cleanList.push(client.ws.candles(currency, "1m", (candle) => {
                // console.log({ currentprice: candles.close });
                // console.log(candle.close,candle.closeTime, Date.now());
                // candle.
                this.pub('currentPrice', candle.close);
            }));
        }
    }

    getValueTopic(topic: string): ArrayTime[] {
        return this.allValueTopic[topic];
    }

    setCallbackFctAllTopic(callback: (topic: string, value: any) => void): void {
        this.allTopicCallBackFct = callback;
    }

    last_save = new Date();

    private pub(topic: string, value: any, time?: number): void {
        if (!time) {
            time = Date.now();
        }
        if (this.allValueTopic[topic] === undefined) {
            this.allValueTopic[topic] = [];
        }
        let filteredValue = this.allValueTopic[topic].filter(x => {
            //@ts-ignore
            let bool = x.time > (time - this.duration);
            return bool;
        });
        let valueToSend = { time, value }
        filteredValue.push(valueToSend);
        if (this.last_save.getTime() < Date.now() - 5 * 60 * 1000) {
            let actual_date = new Date();
            this.last_save = actual_date;
            const duration_m = Math.round((Date.now() - this.getValueTopic(topic)[0].time) / 1000 / 60);
            const file_name = `./data/${actual_date.getDate()}-${actual_date.getMonth()}-${actual_date.getFullYear()}-${actual_date.getHours()}h-${actual_date.getMinutes()}m-${actual_date.getSeconds()}s_duration_${duration_m}.json`;
            writeFile(file_name, JSON.stringify(this.allValueTopic), { flag: 'w' }, (err) => {
                if (err) throw err;
                console.log('File created: ' + file_name);
            });
        }
        this.allValueTopic[topic] = filteredValue;
        if (this.allTopicCallBackFct !== undefined)
            this.allTopicCallBackFct(topic, valueToSend);
    }

    clean(): void {
        for (const clean of this.cleanList) {
            clean();
        }
    }
}
export { Bot };