// was just a test to see how to do multithreading in JS (node)

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
import WebSocket from "ws";
import { WebSocketMessageOut } from "../interface/websocket_interface";
import { MapIdWs } from "./server";

async function main_worker_function() {
    new ServerWorker(workerData);
    while (true);
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


interface DataServerWorker {
    topic_map: { [topic: string]: MapIdWs }
}
export class ServerWorker {

    private topic_map;
    constructor(data: DataServerWorker) {
        this.topic_map = data.topic_map;
    }

    log(str: any) {
        if (isMainThread) {
            console.log(str);
        } else {
            parentPort!.postMessage(str);
        }
    }

    sendDataTopic(topic: string, data: any) {
        this.log({ topic_map: this.topic_map });
        if (this.topic_map[topic]) {
            for (const id in this.topic_map[topic]) {
                let client = this.topic_map[topic][id];
                if (client.readyState === WebSocket.OPEN) {
                    let messageOut: WebSocketMessageOut = {
                        data,
                        event: "data",
                        id,
                        topic
                    }
                    client.send(messageOut, { binary: false });
                }
            }
        }
    }
}

// await _useWorker('./dist/src/worker.js');
function _useWorker(filepath: string) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(filepath, { workerData: { test: 'main_worker_function' } })
        worker.on('online', () => { console.log('Launching intensive CPU task') })
        worker.on('message', messageFromWorker => {
            console.log(messageFromWorker)
            // return resolve
        })
        worker.on('error', reject)
        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })
}
