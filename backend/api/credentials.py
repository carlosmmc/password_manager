from flask import Blueprint, request, jsonify
from .helpers import Param, are_parameters_valid, BASE_PATH, get_base_url

credentials_blueprint = Blueprint("credentials", __name__)

_credential_expected_params = [
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

    if not are_parameters_valid(data, _credential_expected_params):
        error_msg = "The request is missing one or more required attributes."

        return (
            jsonify({"error": error_msg}),
            400,
        )

    created_id = 8910

    return (
        jsonify(
            {
                "id": created_id,
                "self": f"{base_url}/api/v1/accounts/{created_id}",
            }
        ),
        201,
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
        201,
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
        201,
    )


@credentials_blueprint.route(
    f"{BASE_PATH}/<int:account_id>/items/<int:item_id>", methods=["PUT"]
)
def edit_credential(account_id, item_id):
    data = request.get_json()
    base_url = get_base_url(request)

    print(f"account_id is: {account_id}")
    print(f"item_id is: {item_id}")

    if not are_parameters_valid(data, _credential_expected_params):
        error_msg = "The request is missing one or more required attributes."

        return (
            jsonify({"error": error_msg}),
            400,
        )

    return (
        jsonify(
            {
                "id": item_id,
                "self": f"{base_url}/api/v1/accounts/{item_id}",
            }
        ),
        201,
    )


@credentials_blueprint.route(
    f"{BASE_PATH}/<int:account_id>/items/<int:item_id>", methods=["DELETE"]
)
def delete_credential(account_id, item_id):
    print(f"account_id is: {account_id}")
    print(f"item_id is: {item_id}")

    return (
        jsonify({"id": item_id}),
        201,
    )
