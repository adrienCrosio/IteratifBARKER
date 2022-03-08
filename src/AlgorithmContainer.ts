import { BarkCandle } from "../interface/interface_data";
import { AlgorithmParent } from "./algorithm/AlgorithmParent";

export class AlgorithmContainer {

    list_algo: AlgorithmParent[];

    constructor(algo_list: AlgorithmParent[]) {
        this.list_algo = algo_list;
        for (let index = 0; index < algo_list.length; index++) {
            const element = algo_list[index];
            element.setContainer(this);
            element.setId(index);
        }
    }

    onCandleChange(candles: BarkCandle[]) {
        for (const algo of this.list_algo) {
            algo.setCandles(candles);
        }
    }

    algoWantToSell(id: number) {
        console.log(`[SELL]: Algo => ${this.list_algo[id].constructor.name}, ID: "${id}"`);
    }

    algoWantToBuy(id: number) {
        console.log(`[BUY]: Algo => ${this.list_algo[id].constructor.name}, ID: "${id}"`);
    }
}