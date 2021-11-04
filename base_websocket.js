'use strict'

const api_key = require("./apikey.json")
const { Spot } = require('@binance/connector')
const { default: Binance } = require("node-binance-api")

const client = new Spot(api_key.public_key, api_key.secret_key, {
  wsURL: 'wss://testnet.binance.vision' // If optional base URL is not provided, wsURL defaults to wss://stream.binance.com:9443
})


const callbacks = {
  open: () => client.logger.log('open'),
  close: () => client.logger.log('closed'),
  message: data => client.logger.log(data)
}
const aggTrade = client.aggTradeWS('bnbusdt', callbacks)

// unsubscribe the stream above
//setTimeout(() => client.unsubscribe(aggTrade), 3000)

// support combined stream
//const combinedStreams = client.combinedStreams(['btcusdt@miniTicker', 'ethusdt@tikcer'], callbacks)
