import Binance, { Candle, CandleChartInterval_LT, CandleChartResult } from 'binance-api-node';
import api_key from "../apikey.json";
import { BarkCandle } from "../interface/interface_data";

export interface AlgorithmHandlerOption {
    currency: string,
    time_frame: CandleChartInterval_LT
    algorithm_list: any[],
    start_date?: Date,
    end_date?: Date,
}

export class AlgorithmHandler {
    readonly option: AlgorithmHandlerOption;

    candle_data: BarkCandle[] = [];
    last_candle: BarkCandle;


    client = Binance({
        apiKey: api_key.public_key,
        apiSecret: api_key.secret_key,
        getTime: () => Date.now()
    });

    constructor(option: AlgorithmHandlerOption) {
        this.option = option;
        this._initAsyncFunction();
    }

    async _initAsyncFunction() {
        this.getCandles();
        this.subCandle();
    }

    async getCandles() {
        let candles = await this.client.candles({ interval: this.option.time_frame, symbol: this.option.currency, limit: 3 });
        for (const candle of candles) {
            this.candle_data.push({
                closeDate: new Date(candle.closeTime),
                closePrice: parseFloat(candle.close),
                highestPrice: parseFloat(candle.high),
                lowestPrice: parseFloat(candle.low),
                openDate: new Date(candle.openTime),
                openPrice: parseFloat(candle.open)
            })
        }
        this.last_candle = this.candle_data[this.candle_data.length - 1];
    }

    subCandle() {
        this.client.ws.candles(this.option.currency, this.option.time_frame, (candle) => {
            this._callbackCandle(candle);
        });
    }

    _callbackCandle(candle: Candle) {
        if (this.last_candle) {
            if (this.last_candle.closeDate.getTime() !== candle.closeTime) {
                // we have finished a time frame
                console.log("Time frame elpased", candle.closeTime);
                let barkCandle = candleBinanceToBarkCandle(candle);
                this.candle_data.push(barkCandle);
                this.last_candle = barkCandle;
            } else {
                console.log("same time frame", candle.closeTime);
            }
        } else {

            this.last_candle = candleBinanceToBarkCandle(candle);
        }
    }
}

function candleBinanceToBarkCandle(candle: Candle): BarkCandle {
    return {
        closeDate: new Date(candle.closeTime),
        closePrice: parseFloat(candle.close),
        highestPrice: parseFloat(candle.high),
        lowestPrice: parseFloat(candle.low),
        openDate: new Date(candle.startTime),
        openPrice: parseFloat(candle.open)
    }
}

new AlgorithmHandler({ currency: "BTCUSDT", algorithm_list: [], time_frame: '1m' });