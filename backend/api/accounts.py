from flask import Blueprint, request, jsonify
from db import cloud_sql
from .helpers import (
    Param,
    are_parameters_valid,
    BASE_PATH,
    get_base_url,
    StatusCode,
)

accounts_blueprint = Blueprint("accounts", __name__)

_create_account_params = [Param("email", str), Param("public_key", str),
                          Param("private_key", str), Param("account_key", str)]


@accounts_blueprint.route(BASE_PATH, methods=["POST"])
def create_account():
    data = request.get_json()
    base_url = get_base_url(request)

    validation_result = are_parameters_valid(data, _create_account_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), StatusCode.BAD_REQUEST.value)

    created = cloud_sql.create_user_account(data["email"],
                                            data["public_key"],
                                            data["private_key"],
                                            data["account_key"])

    if created[0] is True:
        return (
            jsonify(
                {
                    "id": created[1],
                    "self": f"{base_url}/api/v1/accounts/{created[1]}",
                }
            ),
            StatusCode.CREATED.value,
        )
    else:
        return (jsonify(created[1]), StatusCode.BAD_REQUEST.value)


@accounts_blueprint.route(BASE_PATH, methods=["GET"])
def get_account():
    base_url = get_base_url(request)
    email = request.args.get('email')

    found = cloud_sql.find_user_account(email)

    if found[0] is True:
        return (
            jsonify(
                {
                    "id": found[1]['id'],
                    "self": f"{base_url}/api/v1/accounts/{found[1]['id']}",
                    "public_key": found[1]['public_key'],
                    "private_key": found[1]['private_key'],
                    "account_key": found[1]['account_key'],
                }
            ),
            StatusCode.CREATED.value,
        )
    else:
        return (jsonify(found[1]), StatusCode.NOT_FOUND.value)
