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
      // console.log(dataJson);
      if (dataJson) {
        if (dataJson.event === "connect") {
          this.id = dataJson.id;
          if (this.connected === false)
            this.onConnect();
          console.log("Connected to WebSocket server !");
        } else if (dataJson.event === "data") {
          this.mapCallbackTopic[dataJson.topic](dataJson);
          // console.log({ data: dataJson.data });
        } else if (dataJson.event === "error") {
          console.error({ error: dataJson.data })
        }
      }
    });
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
      topic,
      id: this.id
    }
    this.mapCallbackTopic[topic] = callback;
    if (this.connected) {
      this.websocketService.sendMessage(message)
    } else {
      this.onConnectionFct.push(() => {
        this.websocketService.sendMessage(message)
      })
    }

  }
}
