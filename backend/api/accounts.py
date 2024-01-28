from flask import Blueprint, request, jsonify
from .helpers import (
    Param,
    are_parameters_valid,
    BASE_PATH,
    get_base_url,
    HttpStatusCode,
)

accounts_blueprint = Blueprint("accounts", __name__)

_create_account_params = [Param("email", str)]


@accounts_blueprint.route(BASE_PATH, methods=["POST"])
def create_account():
    data = request.get_json()
    base_url = get_base_url(request)

    validation_result = are_parameters_valid(data, _create_account_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), HttpStatusCode.BAD_REQUEST)

    email = data["email"]
    created_id = 1234

    return (
        jsonify(
            {
                "id": created_id,
                "self": f"{base_url}/api/v1/accounts/{created_id}",
            }
        ),
        HttpStatusCode.CREATED,
    )
