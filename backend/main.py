"""entry point for flask backend"""

import google.auth

from dotenv import load_dotenv
from flask import Flask

from api.accounts import accounts_blueprint
from api.credentials import credentials_blueprint
import google.cloud.logging as cloud_logging
from middleware.auth import init_auth_middleware
from middleware.api_observability import emit_api_observability

_, project = google.auth.default()

load_dotenv()
app = Flask(__name__, static_folder="build", static_url_path="/")

# register middleware
# init_auth_middleware(app)
app.after_request(emit_api_observability)

# register API methods
app.register_blueprint(accounts_blueprint)
app.register_blueprint(credentials_blueprint)

client = cloud_logging.Client(project=project)
logger = client.logger("MAIN_APPLICATION")


@app.route("/")
def root():
    # to get user once we add auth back in
    # user = g.user if g.user else None
    return app.send_static_file("index.html")


logger.log_text("!! flask backend started successfully !!", severity="INFO")

if __name__ == "__main__":
    # for local development only
    app.run(host="127.0.0.1", port=8080, debug=True)
