# mock_server/main.py

import random
import time
from fastapi import FastAPI
from fastapi.responses import JSONResponse


app = FastAPI()

@app.get("/health")
def health_status():
    """check the health of the server."""
    status = "up" if random.random() > 0.1 else "down"
    return {"status": status}

@app.get("/metrics")
def metrics():
    """return random CPU and memory usage."""
    return {
        "cpu_usage": round(random.uniform(10.5, 85.5), 2),
        "memory_usage": round(random.uniform(1024, 8192), 2),
    }

@app.get("/logs")
def logs():
    """return random logs."""
    sample_logs = [
        f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] INFO Server running smoothly",
        f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] WARN High CPU usage detected",
        f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ERROR Memory spike observed"
    ]
    return {"logs": random.sample(sample_logs, 2)}

@app.post("/reset")
def reset_system():
    """stimulate a system reset."""
    return JSONResponse(content={"message": "System reset triggered."}, status_code=200)
