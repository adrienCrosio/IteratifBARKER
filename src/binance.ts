import Binance from 'binance-api-node';
import api_key from "../apikey.json";

class Bot {
    constructor() {
        const client = Binance({
            apiKey: api_key.public_key,
            apiSecret: api_key.secret_key,
            getTime: () => Date.now()
        });

        const clean = client.ws.ticker('ETHBTC', ticker => {
            console.log({ ticker });
        })

        setTimeout(() => {
            console.log("clean");
            clean();
        }, 5000)
    }
}
export { Bot };