# Configuration file for server monitoring system

# Mock API endpoints (local FastAPI mock server)
SERVER_HEALTH_ENDPOINT = "http://localhost:8080/health"
SERVER_METRICS_ENDPOINT = "http://localhost:8080/metrics"
SERVER_LOGS_ENDPOINT = "http://localhost:8080/logs"
SERVER_RESET_ENDPOINT = "http://localhost:8080/reset"

# Monitoring interval in seconds
MONITOR_INTERVAL = 5  # adjust as needed

# Failover settings
FAILOVER_ENABLED = True
FAILOVER_TRIGGER_STATUS = "down"

# Optional: backup server URL (can be simulated later)
BACKUP_SERVER_IP = "127.0.0.2"
