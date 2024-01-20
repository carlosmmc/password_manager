"""entry point for flask backend"""

import os
import datetime

import google.oauth2.id_token
from dotenv import load_dotenv

from flask import Flask, render_template, request
from google.auth.transport import requests
from google.cloud import datastore

app = Flask(__name__)
datastore_client = datastore.Client()
firebase_request_adapter = requests.Request()
load_dotenv()

firebase_config = {
    "apiKey": os.environ.get("FIREBASE_API_KEY"),
    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.environ.get("FIREBASE_PROJECT_ID"),
    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.environ.get("FIREBASE_APP_ID"),
}


@app.route("/")
def root():
    """root api method of the application"""
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    times = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. If the token is not valid a `ValueError` will be raised a;asdfasdflaksdjf;alsdkjfl;asdkjfl;asdkjfl;kjslkdjfa;slkjfdlas;kjdf;laskjfkdkkdkdkd
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter
            )
            current_date_time = datetime.datetime.now(tz=datetime.timezone.utc)
            store_time(claims["email"], current_date_time)
            times = fetch_times(claims["email"], 10)

        except ValueError as exc:
            error_message = str(exc)

    return render_template(
        "index.html",
        user_data=claims,
        error_message=error_message,
        times=times,
        firebase_config=firebase_config,
    )


def store_time(email, dt):
    """store access time into datastore"""
    entity = datastore.Entity(key=datastore_client.key("User", email, "visit"))
    entity.update({"timestamp": dt})

    datastore_client.put(entity)


def fetch_times(email, limit):
    """temp function to fetch list of times user has accessed appplication"""
    ancestor = datastore_client.key("User", email)
    query = datastore_client.query(kind="visit", ancestor=ancestor)
    query.order = ["-timestamp"]

    times = query.fetch(limit=limit)

    return times


if __name__ == "__main__":
    # for local development only
    app.run(host="127.0.0.1", port=8080, debug=True)
