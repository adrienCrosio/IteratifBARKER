import { BarkCandle } from "../../interface/interface_data";
import { AlgorithmParent } from "./AlgorithmParent";


//very simple algo to show how to implement the architecture
export class ExempleAlgo extends AlgorithmParent {

    onCandleChange(candles: BarkCandle[]) {
        const lastCandle = this.getLastCandle();
        if (lastCandle.openPrice < lastCandle.closePrice) {
            this.buy();
        } else {
            this.sell();
        }
    }

}