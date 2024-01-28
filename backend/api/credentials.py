from flask import Blueprint, request, jsonify
from .helpers import (
    Param,
    are_parameters_valid,
    BASE_PATH,
    get_base_url,
    HttpStatusCode,
)

credentials_blueprint = Blueprint("credentials", __name__)

_credential_modify_params = [
    Param("kid", str),
    Param("enc", str),
    Param("cty", str),
    Param("data", str),
]


@credentials_blueprint.route(f"{BASE_PATH}/<int:account_id>/items", methods=["POST"])
def create_credential(account_id):
    data = request.get_json()
    base_url = get_base_url(request)

    print(f"account_id is: {account_id}")

    validation_result = are_parameters_valid(data, _credential_modify_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), HttpStatusCode.BAD_REQUEST)

    created_id = 8910

    return (
        jsonify(
            {
                "id": created_id,
                "self": f"{base_url}/api/v1/accounts/{created_id}",
            }
        ),
        HttpStatusCode.CREATED,
    )


@credentials_blueprint.route(f"{BASE_PATH}/<int:account_id>/items", methods=["GET"])
def view_all_credentials(account_id):
    base_url = get_base_url(request)

    print(f"account_id is: {account_id}")

    return (
        jsonify(
            [
                {
                    "id": 8910,
                    "kid": "867fghjkl",
                    "enc": "A256GCM",
                    "cty": "b5+jwk+json",
                    "data": "rdfthyukjlA4nmajhgf",
                    "self": f"{base_url}/api/v1/accounts/1234/items/8910",
                },
                {
                    "id": 5678,
                    "kid": "867fghjkl",
                    "enc": "A256GCM",
                    "cty": "b5+jwk+json",
                    "data": "jemccouandsfbfrh7au",
                    "self": f"{base_url}/api/v1/accounts/1234/items/5678",
                },
            ]
        ),
        HttpStatusCode.OK,
    )


@credentials_blueprint.route(
    f"{BASE_PATH}/<int:account_id>/items/<int:credential_id>", methods=["GET"]
)
def view_credential(account_id, credential_id):
    print(f"account_id is: {account_id}")
    print(f"credential_id is: {credential_id}")

    return (
        jsonify(
            {
                "id": 8910,
                "kid": "867fghjkl",
                "enc": "A256GCM",
                "cty": "b5+jwk+json",
                "data": "rdfthyukjlA4nmajhgf",
            }
        ),
        HttpStatusCode.OK,
    )


@credentials_blueprint.route(
    f"{BASE_PATH}/<int:account_id>/items/<int:credential_id>", methods=["PUT"]
)
def edit_credential(account_id, credential_id):
    data = request.get_json()
    base_url = get_base_url(request)

    print(f"account_id is: {account_id}")
    print(f"credential_id is: {credential_id}")

    validation_result = are_parameters_valid(data, _credential_modify_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), HttpStatusCode.BAD_REQUEST)

    return (
        jsonify(
            {
                "id": credential_id,
                "self": f"{base_url}/api/v1/accounts/{credential_id}",
            }
        ),
        HttpStatusCode.OK,
    )


@credentials_blueprint.route(
    f"{BASE_PATH}/<int:account_id>/items/<int:credential_id>", methods=["DELETE"]
)
def delete_credential(account_id, credential_id):
    print(f"account_id is: {account_id}")
    print(f"credential_id is: {credential_id}")

    return (
        jsonify({"id": credential_id}),
        HttpStatusCode.OK,
    )
