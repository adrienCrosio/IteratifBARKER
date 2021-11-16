import { Bot } from "./binance";

function main() {
    new Bot();
};

if (require.main === module) {
    console.log('called directly');
    main();
}

export { main };