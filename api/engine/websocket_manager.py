from fastapi import WebSocket
from typing import Dict, List


class WebSocketManager:
    def __init__(self):
        self.connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, simulation_id: str, websocket: WebSocket):
        await websocket.accept()
        if simulation_id not in self.connections:
            self.connections[simulation_id] = []
        self.connections[simulation_id].append(websocket)

    def disconnect(self, simulation_id: str, websocket: WebSocket):
        if simulation_id in self.connections:
            self.connections[simulation_id].remove(websocket)

    async def broadcast(self, simulation_id: str, payload: dict):
        """Broadcast a message to all connected clients for a simulation."""
        if simulation_id not in self.connections:
            return

        disconnected = []

        for websocket in self.connections[simulation_id]:
            try:
                await websocket.send_json(payload)
            except Exception:
                disconnected.append(websocket)

        for ws in disconnected:
            self.connections[simulation_id].remove(ws)


manager = WebSocketManager()