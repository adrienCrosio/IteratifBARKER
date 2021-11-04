import Binance from 'binance-api-node'

const client = Binance()

// Authenticated client, can make signed calls
const client2 = Binance({
    apiKey: 'xxx',
    apiSecret: 'xxx',
    getTime: () => Date.now()
})

client.time().then(time => console.log(time))