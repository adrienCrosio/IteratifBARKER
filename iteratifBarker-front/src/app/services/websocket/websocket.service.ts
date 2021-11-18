import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { WebSocketMessageOut } from "../../../../../interface/websocket_interface"
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private observable!: Observable<MessageEvent>;
  // private observer: Subject<WebSocketMessageIn>;
  private socket!: WebSocket;
  private connected: boolean = false;
  constructor() { }

  sendMessage(data: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  isConnected() {
    return this.connected;
  }

  connect(url: string): Observable<MessageEvent<string>> {
    this.socket = new WebSocket(url);
    this.observable = new Observable(
      (observer: Observer<MessageEvent>) => {
        this.socket.onmessage = observer.next.bind(observer);
        this.socket.onerror = observer.error.bind(observer);
        this.socket.onclose = observer.complete.bind(observer);
        return this.socket.close.bind(this.socket);
      }
    );
    this.connected = true;
    return this.observable;
  }
}