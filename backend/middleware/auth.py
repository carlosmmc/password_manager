from flask import request, g, jsonify
from google.auth.transport import requests
import google.oauth2.id_token


def init_auth_middleware(app):
    firebase_request_adapter = requests.Request()

    @app.before_request
    def check_auth():
        """Middleware function to check user authentication."""
        g.user = None
        id_token = request.cookies.get("token")

        if id_token:
            try:
                # Verify the token against the Firebase Auth API.
                # If the token is not valid a `ValueError` will be raised
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter
                )
                g.user = claims

            except ValueError as exc:
                return jsonify({"error": str(exc)}), 401

        if not g.user:
            return jsonify({"error": "Unauthorized access"}), 401
