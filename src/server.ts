import express from 'express';
import WebSocket from 'ws';
import { createServer } from 'http';
import { WebSocketMessageOut, WebSocketMessageIn } from "../interface/websocket_interface"
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
            let id_user: string;
            if (messageIn.id) {
                id_user = messageIn.id;
            } else {
                cpt_id = cpt_id + 1;
                id_user = cpt_id.toString();
            }

            if (messageIn.event === "sub") {
                subTopic(messageIn.topic, id_user, ws);
            } else if (messageIn.event === "unsub") {
                unsubTopic(messageIn.topic, id_user);
            } else {
                //do nothing for now
            }
            ws.send(`Hello, you sent -> ${message}`);
        } catch (error: any) {
            ws.send(`ERROR -> ${(error as Error).message}`);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

export interface MapIdWs {
    [id: string]: WebSocket
}
let topic_map: { [topic: string]: MapIdWs } = {};
function subTopic(topic: string, id: string, ws: WebSocket) {
    if (!topic_map[topic]) {
        topic_map[topic] = {};
    }
    topic_map[topic][id] = ws;
}

function unsubTopic(topic: string, id: string) {
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
    console.log({ topic, data });
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
/**------------------------------------------------------------------------------------**/
/**------------------------------------------------------------------------------------**/

// Init the server
server.listen(8080, async () => {
    // @ts-ignore
    const port = server.address().port;
    console.log("App now running on port", port);
    setInterval(() => {
        sendDataTopic('status', "UP");
    }, 5000);
});

