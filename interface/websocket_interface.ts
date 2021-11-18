interface WebSocket {
    topic: string,
    id?: string,
    event: string
}

interface WebSocketMessageIn extends WebSocket {
    event: "sub" | "unsub",
}
interface WebSocketMessageOut extends WebSocket {
    event: "data" | "connect" | "sub" | "unsub" | "error",
    id: string,
    data: any
}
export { WebSocketMessageOut, WebSocketMessageIn }