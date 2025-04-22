# monitor/health_check.py

import time
from datetime import datetime
import requests
import psutil
from config import PRIMARY_SERVER

PRIMARY_SERVER = "http://your-custom-server-ip:port"  # Replace with your server IP
CHECK_INTERVAL = 5  # seconds
LOG_FILE = "logs/server_log.txt"
FAILOVER_ENDPOINT = "http://localhost:6000/failover"  # Go server endpoint

def log_event(message):
    """
    Logs a message with a timestamp to the log file and prints it to the console.

    Args:
        message (Any): The message to be logged.
    """
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{datetime.now()} - {message}\n")
    print(message)


def is_server_alive(url):
    """
    Checks if the server at the given URL is responding with a status code 200.

    Args:
        url (str): The server URL to check.

    Returns:
        bool: True if the server is up, False otherwise.
    """
    try:
        response = requests.get(url, timeout=3)
        return response.status_code == 200
    except requests.RequestException:
        return False


def check_system_health():
    """
    Checks the system's CPU and memory usage, and logs a warning if either exceeds 90%.

    Returns:
        tuple: A tuple containing CPU usage (%) and memory usage (%).
    """
    cpu = psutil.cpu_percent()
    mem = psutil.virtual_memory().percent
    if cpu > 90 or mem > 90:
        log_event(f"WARNING: High resource usage - CPU: {cpu}%, RAM: {mem}%")
    return cpu, mem

def trigger_failover():
    """
    Attempts to trigger a failover by calling the local failover endpoint.
    Logs the response or error if the request fails.
    """
    try:
        response = requests.get(FAILOVER_ENDPOINT, timeout=5)
        log_event(f"Failover triggered: {response.text}")
    except requests.RequestException as e:
        log_event(f"Failed to trigger failover: {e}")
        
def check_server_health():
    """Checks the health of the primary server and logs the result."""
    try:
        response = requests.get(PRIMARY_SERVER, timeout=3)
        if response.status_code == 200:
            return True, "Server is responsive"
        else:
            return False, f"Server responded with status code: {response.status_code}"
    except requests.RequestException:
        return False, "Health check failed - connectivity issue detected"


def get_usage():
    """"Returns the current CPU and memory usage of the system."""
    return {
        "cpu": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory().percent
    }


# Monitoring loop
while True:
    print("Checking primary server...")
    check_system_health()

    if not is_server_alive(PRIMARY_SERVER):
        log_event("Primary server down! Initiating failover...")
        trigger_failover()
    else:
        log_event("Primary server healthy.")

    time.sleep(CHECK_INTERVAL)