import { BarkCandle } from "../../interface/interface_data";
import { AlgorithmContainer } from "../AlgorithmContainer";

export abstract class AlgorithmParent {

    private candles: BarkCandle[] = [];
    private buyFct: (id: number) => void;
    private sellFct: (id: number) => void;
    private id: number;
    private container: AlgorithmContainer;

    constructor() {
    }

    setContainer(container: AlgorithmContainer) {
        this.container = container
    }

    sell() {
        console.log("Sell !");
        if (this.container)
            this.container.algoWantToSell(this.id);
    }

    buy() {
        console.log("Buy !");
        if (this.container)
            this.container.algoWantToBuy(this.id);
    }

    setId(id: number) {
        this.id = id;
    }

    setCandles(candles: BarkCandle[]) {
        this.candles = candles;
        this.onCandleChange(candles)
    }

    abstract onCandleChange(candles: BarkCandle[])

    getLastCandle(): BarkCandle {
        return this.candles[this.candles.length - 1];
    }

}