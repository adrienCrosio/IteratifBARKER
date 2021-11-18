import Binance, { ReconnectingWebSocketHandler } from 'binance-api-node';
import api_key from "../apikey.json";

class Bot {
    private cleanList: ReconnectingWebSocketHandler[] = [];
    private allTopicCallBackFct!: (topic: string, value: any) => void;
    constructor() {
        const client = Binance({
            apiKey: api_key.public_key,
            apiSecret: api_key.secret_key,
            getTime: () => Date.now()
        });
        const currency = 'ETHBTC'
        // let clean = client.ws.aggTrades(currency, (trad) => {
        //     console.log({ trad });
        // });

        // let clean = client.ws.candles(currency,"1s", (ticker) => {
        //     console.log({ ticker });
        // });

        this.cleanList.push(client.ws.candles(currency, "1m", (candles) => {
            console.log({ currentprice: candles.close });
            if (this.allTopicCallBackFct !== undefined)
                this.allTopicCallBackFct('currentPrice', candles.close);
        }));

        setTimeout(() => {
            console.log("clean")
            // clean();
        }, 10000);
    }

    setCallbackFctAllTopic(callback: (topic: string, value: any) => void) {
        this.allTopicCallBackFct = callback;
    }

    clean() {
        for (const clean of this.cleanList) {
            clean();
        }
    }
}
export { Bot };