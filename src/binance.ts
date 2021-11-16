import Binance from 'binance-api-node';
import api_key from "../apikey.json";



class Bot {
    constructor() {
        const client = Binance({
            apiKey: api_key.public_key,
            apiSecret: api_key.secret_key,
            getTime: () => Date.now()
        });
        
        const clean = client.ws.ticker('ETHBTC', depth => {
            console.log({ depth });
        })
        
        setTimeout(() => {
            console.log("clean");
            clean();
        }, 2000)
    }
}
// just to be able to launch this file from the index.ts 
// (which is the file executed by default)
export { Bot };