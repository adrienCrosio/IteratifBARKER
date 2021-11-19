interface WebSocketData {
    time: number,
    value: any
}

interface WebSocketDataCurrentPrice extends WebSocketData {
    value: number,
}
export { WebSocketDataCurrentPrice }