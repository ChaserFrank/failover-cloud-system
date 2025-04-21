# monitor/socket_server.py

from datetime import datetime
import socketio
import eventlet
from monitor.health_check import check_server_health

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

@sio.event
def connect(sid, environ):
    """Event handler for new client connections."""
    print(f"[CONNECTED] Client {sid}")

@sio.event
def disconnect(sid):
    """Event handler for client disconnections."""
    print(f"[DISCONNECTED] Client {sid}")

# Periodic updates
def emit_status():
    """Function to emit server status updates to connected clients."""
    while True:
        status = check_server_health()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data = {
            'timestamp': now,
            'status': status
        }
        sio.emit('server_status', data)
        eventlet.sleep(10)  # Update every 10 seconds

if __name__ == '__main__':
    print("[SOCKET SERVER STARTED]")
    eventlet.spawn(emit_status)
    eventlet.wsgi.server(eventlet.listen(('', 5001)), app)
