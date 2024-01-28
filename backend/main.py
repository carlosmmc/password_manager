"""entry point for flask backend"""

import datetime

from dotenv import load_dotenv
from flask import Flask, render_template, g, request, jsonify

from db.cloud_sql import get_user_passwords
from db.firebase import get_firebase_config, store_time, fetch_times
from middleware.auth import init_auth_middleware
from api.accounts import accounts_blueprint
from api.credentials import credentials_blueprint

load_dotenv()
app = Flask(__name__)

# register middleware
init_auth_middleware(app)

# register API methods
app.register_blueprint(accounts_blueprint)
app.register_blueprint(credentials_blueprint)


@app.route("/")
def root():
    user = g.user if g.user else None
    current_date_time = None
    times = None
    password_info = None

    if user:
        user_email_address = user["email"]
        current_date_time = datetime.datetime.now(tz=datetime.timezone.utc)
        store_time(user_email_address, current_date_time)
        times = fetch_times(user_email_address, 5)
        password_info = get_user_passwords(user_email_address, limit=5)

    return render_template(
        "index.html",
        user_data=user,
        times=times,
        firebase_config=get_firebase_config(),
        password_info=password_info,
    )


if __name__ == "__main__":
    # for local development only
    app.run(host="127.0.0.1", port=8080, debug=True)
