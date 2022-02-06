import express from 'express';
import WebSocket from 'ws';
import { createServer } from 'http';
import { WebSocketMessageOut, WebSocketMessageIn } from "../interface/websocket_interface"
import { main } from '.';
import { Bot } from './binance';
const app = express();


/****************************************************************************************/
/********************************** HANDLE EXPRESS **************************************/
/****************************************************************************************/

app.use(express.json());

/**************************************************************************************/
// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
// const distDir = "iteratifBarker-front/dist/";
// app.use(express.static(distDir));
/*** BUT DOES NOT CHANGE ANYTHING FOR ME AT THAT MOMENT I DONT UNDERSTAND THIS LINE ***/

app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});


app.get("/api/get_data_by_topic", function (req, res) {
    let data_topic = bot.getValueTopic(req.query.topic as string);
    res.status(200).json({ data: data_topic });
});

/**------------------------------------------------------------------------------------**/
/**------------------------------------------------------------------------------------**/

/****************************************************************************************/
/********************************** HANDLE WEBSOCKET ************************************/
/****************************************************************************************/
const server = createServer(app);
const wss = new WebSocket.Server({ server });
let cpt_id: number = 0;
wss.on('connection', (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    console.log("A connection !!");
    ws.on('message', (message) => {
        try {
            let messageIn: WebSocketMessageIn = JSON.parse(message.toString());
            console.log({ messageIn });
            let id_user: string;
            if (messageIn.id) {
                id_user = messageIn.id;
            } else {
                throw new Error("No id sent !");
            }

            if (messageIn.event === "sub") {
                subTopic(messageIn.topic, id_user, ws);
            } else if (messageIn.event === "unsub") {
                unsubTopic(messageIn.topic, id_user);
            } else {
                //do nothing for now
            }
            let messageOut: WebSocketMessageOut = {
                data: bot.getValueTopic(messageIn.topic),
                event: messageIn.event,
                id: id_user,
                topic: messageIn.topic
            };
            ws.send(JSON.stringify(messageOut));
        } catch (error: any) {
            let messageOut: WebSocketMessageOut = {
                data: (error as Error).message,
                event: "error",
                id: "-1",
                topic: "error"
            };
            ws.send(JSON.stringify(messageOut));
        }
    });

    cpt_id = cpt_id + 1;
    let id_user_g = cpt_id.toString();
    let messageOut: WebSocketMessageOut = {
        data: "connected",
        event: "connect",
        id: id_user_g,
        topic: "connection"
    }
    //send immediatly a feedback to the incoming connection    
    ws.send(JSON.stringify(messageOut));
});

export interface MapIdWs {
    [id: string]: WebSocket
}
let topic_map: { [topic: string]: MapIdWs } = {};
function subTopic(topic: string, id: string, ws: WebSocket) {
    console.log(`SUB : ${topic}, id:${id}`);
    if (!topic_map[topic]) {
        topic_map[topic] = {};
    }
    topic_map[topic][id] = ws;
}

function unsubTopic(topic: string, id: string) {
    console.log(`UNSUB : ${topic}, id:${id}`);
    if (!topic_map[topic]) {
        topic_map[topic] = {};
    }
    if (topic_map[topic][id]) {
        delete topic_map[topic][id];
        if (Object.keys(topic_map[topic]).length === 0) {
            delete topic_map[topic];
        }
    }
}

function sendDataTopic(topic: string, data: any) {
    console.log({ topic });
    if (topic_map[topic]) {
        for (const id in topic_map[topic]) {
            let client = topic_map[topic][id];
            if (client.readyState === WebSocket.OPEN) {
                let messageOut: WebSocketMessageOut = {
                    data,
                    event: "data",
                    id,
                    topic
                }
                client.send(JSON.stringify(messageOut), { binary: false });
            }
        }
    }
}

/****************************************************************************************/
/********************************** HANDLE WEBSOCKET ************************************/
/****************************************************************************************/

/**------------------------------------------------------------------------------------**/
/**------------------------------------------------------------------------------------**/

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        //@ts-ignore
        process.emit("SIGINT");
    });
}

let bot!: Bot;
// Init the server
server.listen(8080, async () => {
    // @ts-ignore
    const port = server.address().port;
    console.log("App now running on port", port);
    bot = main();
    bot.setCallbackFctAllTopic((topic, value) => {
        sendDataTopic(topic, value);
    })
    setInterval(() => {
        sendDataTopic('status', "UP");
    }, 5000);
    process.on("SIGINT", function () {
        console.log("ctr+C catch");
        bot.clean();
        //graceful shutdown
        process.exit();
    });
});

