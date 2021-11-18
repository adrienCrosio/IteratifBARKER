import Binance from 'binance-api-node';
import api_key from "../apikey.json";

class Bot {
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

        // let clean = client.ws.ticker(currency, (ticker) => {
        //     console.log({ ticker });
        // });

        let clean = client.ws.candles(currency, "1s", (candles) => {
            // candles.
            console.log({ currentprice: candles.close });
        });

        setTimeout(() => {
            console.log("clean");
            clean();
        }, 5000)
    }
}
export { Bot };