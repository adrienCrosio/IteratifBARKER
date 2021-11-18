interface WebSocket {
    topic: string,
    id?: string,
    event: string
}

interface WebSocketMessageIn extends WebSocket {
    event: "sub" | "unsub",
}
interface WebSocketMessageOut extends WebSocket {
    event: "data",
    id: string,
    data:any
}
export { WebSocketMessageOut, WebSocketMessageIn }