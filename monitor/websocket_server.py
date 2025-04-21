# monitor/websocket_server.py

import json
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    """websocket endpoint to send periodic updates to connected clients."""
    await websocket.accept()
    while True:
        data = {
            "server_status": "online",
            "cpu_usage": 28,
            "memory_usage": 65,
            "failover": False,
            "logs": [
                {"type": "info", "message": "Server is stable", "timestamp": "08:31 AM"}
            ]
        }
        await websocket.send_text(json.dumps(data))
        await asyncio.sleep(5)  # simulate periodic update

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
