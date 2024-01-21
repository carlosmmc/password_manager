"""entry point for flask backend"""

import datetime

from dotenv import load_dotenv
from flask import Flask, render_template, g

from db.cloud_sql import get_user_passwords
from db.firebase import get_firebase_config, store_time, fetch_times
from middleware.auth import init_auth_middleware

app = Flask(__name__)
load_dotenv()
init_auth_middleware(app)


@app.route("/")
def root():
    user_email_address = g.user["email"]
    current_date_time = datetime.datetime.now(tz=datetime.timezone.utc)
    store_time(user_email_address, current_date_time)
    times = fetch_times(user_email_address, 5)
    password_info = get_user_passwords(user_email_address, limit=5)

    return render_template(
        "index.html",
        user_data=g.user,
        times=times,
        firebase_config=get_firebase_config(),
        password_info=password_info,
    )


if __name__ == "__main__":
    # for local development only
    app.run(host="127.0.0.1", port=8080, debug=True)
