import Binance, { BidDepth, ReconnectingWebSocketHandler } from 'binance-api-node';
import { ArrayTime } from '../interface/bot_inner_interface';
import api_key from "../apikey.json";

class Bot {
    private cleanList: ReconnectingWebSocketHandler[] = [];
    private allTopicCallBackFct!: (topic: string, value: any) => void;
    private allValueTopic: { [topic: string]: ArrayTime[] } = {};
    private duration: number = 1 * 60 * 1000; //20 min
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

    getValueTopic(topic: string): any[] {
        return this.allValueTopic[topic];
    }

    setCallbackFctAllTopic(callback: (topic: string, value: any) => void): void {
        this.allTopicCallBackFct = callback;
    }

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