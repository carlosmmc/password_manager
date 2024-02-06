import google.auth
from flask import request
import google.cloud.logging as cloud_logging

_, project = google.auth.default()
client = cloud_logging.Client(project=project)
logger = client.logger("HTTPS_REQUEST_LOGS")


def emit_api_observability(response):
    log_data = {
        "endpoint": request.endpoint,
        "method": request.method,
        "url": request.url,
        "status": response.status,
    }

    severity = "CRITICAL" if response.status_code >= 500 else "INFO"
    logger.log_struct(log_data, severity=severity)

    return response
