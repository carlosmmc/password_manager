from flask import Blueprint, request, jsonify
from .helpers import Param, are_parameters_valid

accounts_blueprint = Blueprint("accounts", __name__)

BASE_URL = "/api/v1/accounts"


@accounts_blueprint.route(BASE_URL, methods=["POST"])
def create_account():
    data = request.get_json()
    base_url = request.url_root.rstrip("/")

    expected_params = [Param("email", str)]

    if not are_parameters_valid(data, expected_params):
        error_msg = (
            'Invalid request, "email" must be included and be of the string type.'
        )

        return (
            jsonify({"error": error_msg}),
            400,
        )

    email = data["email"]
    created_id = 1234

    return (
        jsonify(
            {
                "id": created_id,
                "self": f"{base_url}/api/v1/accounts/{created_id}",
            }
        ),
        201,
    )
