# monitor/monitor_api.py

import os
from datetime import datetime
from flask import Flask, jsonify
from monitor.health_check import check_server_health, get_usage

app = Flask(__name__)

LOG_FILE = "logs/server_log.txt"

@app.route('/status', methods=['GET'])
def status():
    """Check and report the current system status."""
    health, message = check_server_health()
    return jsonify({
        'status': 'ONLINE' if health else 'OFFLINE',
        'message': message,
        'lastChecked': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/usage', methods=['GET'])
def usage():
    """Endpoint to return system usage data."""
    usage_data = get_usage()
    return jsonify(usage_data)

@app.route('/logs', methods=['GET'])
def logs():
    """Endpoint to return the last 20 lines of the log file."""
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            log_lines = f.readlines()[-20:]  # return last 20 lines
        return jsonify({'logs': log_lines})
    except FileNotFoundError:
        return jsonify({'logs': [], 'error': 'Log file not found'}), 404

if __name__ == '__main__':
    app.run(port=5000)
