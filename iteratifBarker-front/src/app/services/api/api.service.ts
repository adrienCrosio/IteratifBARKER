import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebSocketMessageIn, WebSocketMessageOut } from "../../../../../interface/websocket_interface"
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private mapCallbackTopic: { [topic: string]: (data: WebSocketMessageOut) => void } = {};
  private connected = false;
  private onConnectionFct: (() => void)[] = [];
  private id!: string;
  constructor(private websocketService: WebsocketService) {
    this.websocketService.connect(`ws://${environment.url}`).subscribe((data) => {
      let dataJson: WebSocketMessageOut | null = null;
      try {
        dataJson = JSON.parse(data.data);
      } catch (error) {
        console.error(`JSON could not be parsed :\n${data.data}`)
      }
      if (dataJson) {
        if (dataJson.event === "connect") {
          this.id = dataJson.id;
          if (this.connected === false)
            this.onConnect();
          console.log(`Connected to WebSocket server with id: ${this.id}!`);
        } else if (dataJson.event === "data") {
          this.sendToTopic(dataJson);
          // console.log({ data: dataJson.data });
        } else if (dataJson.event === "sub") {
          // console.log(dataJson);
          this.sendToTopic(dataJson);
        } else if (dataJson.event === "error") {
          console.error({ error: dataJson.data })
        }
      }
    });
  }

  // this function is use to simulate ws values coming in
  sendToTopic(value: WebSocketMessageOut) {
    // console.log(this.mapCallbackTopic[value.topic],value.topic);
    this.mapCallbackTopic[value.topic](value);
  }

  onConnect() {
    this.connected = true;
    for (const fct of this.onConnectionFct) {
      fct();
    }
    this.onConnectionFct = [];
  }

  subTopic(topic: string, callback: (data: WebSocketMessageOut) => void) {
    let message: WebSocketMessageIn = {
      event: "sub",
      topic
    }
    this.mapCallbackTopic[topic] = callback;
    if (this.connected) {
      this.sendMessage(message);
    } else {
      this.onConnectionFct.push(() => {
        this.sendMessage(message);
      })
    }
  }

  private sendMessage(message: WebSocketMessageIn) {
    message.id = this.id;
    this.websocketService.sendMessage(message);
  }
}
