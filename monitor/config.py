# Configuration file for the monitoring service

from flask import Flask, jsonify
import psutil
import requests

app = Flask(__name__)

PRIMARY_SERVER = "http://your-custom-server-ip:port"  # Replace with actual server

def check_server():
    """Check if the primary server is reachable."""
    try:
        r = requests.get(PRIMARY_SERVER, timeout=3)
        return r.status_code == 200
    except requests.RequestException:
        return False


@app.route("/api/health", methods=["GET"])
def get_health():
    """Endpoint to check the health of the server."""
    health = {
        "cpu": psutil.cpu_percent(),
        "memory": psutil.virtual_memory().percent,
        "server_status": "UP" if check_server() else "DOWN"
    }
    return jsonify(health)

if __name__ == '__main__':
    app.run(port=5001)
