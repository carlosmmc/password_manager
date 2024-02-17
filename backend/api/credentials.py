from json import dumps
from flask import Blueprint, request, jsonify
from db import cloud_sql
from .helpers import (
    Param,
    are_parameters_valid,
    BASE_PATH,
    get_base_url,
    StatusCode,
)

credentials_blueprint = Blueprint("credentials", __name__)

_credential_modify_params = [
    Param("kid", str),
    Param("enc", str),
    Param("cty", str),
    Param("overview", str),
    Param("details", str),
]


@credentials_blueprint.route(f"{BASE_PATH}/<account_id>/items", methods=["POST"])
def create_credential(account_id):
    data = request.get_json()
    base_url = get_base_url(request)

    validation_result = are_parameters_valid(data, _credential_modify_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), StatusCode.BAD_REQUEST.value)

    created = cloud_sql.create_item(
        account_id, data["kid"], data["overview"], data["details"]
    )

    if created[0] is True:
        return (
            jsonify(
                {
                    "id": created[1],
                    "self": f"{base_url}/api/v1/accounts/{account_id}/items/{created[1]}",
                }
            ),
            StatusCode.CREATED.value,
        )
    else:
        return (jsonify(created[1]), StatusCode.BAD_REQUEST.value)


@credentials_blueprint.route(f"{BASE_PATH}/<account_id>/items", methods=["GET"])
def view_all_credentials(account_id):
    base_url = get_base_url(request)

    found = cloud_sql.find_user_items(account_id)

    if found[0] is True:
        items = []
        for item in found[1]:
            new_item = dict(item)
            new_item[
                "self"
            ] = f"{base_url}/api/v1/accounts/{account_id}/items/{new_item['id']}"            new_item["cty"] = "b5+jwk+json"
            items.append(new_item)
        return (
            jsonify(items),
            StatusCode.OK.value,
        )
    else:
        return (jsonify(found[1]), StatusCode.NOT_FOUND.value)


@credentials_blueprint.route(
    f"{BASE_PATH}/<account_id>/items/<item_id>", methods=["GET"]
)
def view_credential(account_id, item_id):

    found = cloud_sql.find_item(account_id, item_id)

    if found[0] is True:
        new_item = dict(found[1])
        new_item["cty"] = "b5+jwk+json"
        return (jsonify(new_item), StatusCode.OK.value)
    else:
        return (jsonify(found[1]), StatusCode.NOT_FOUND.value)


@credentials_blueprint.route(
    f"{BASE_PATH}/<account_id>/items/<item_id>", methods=["PUT"]
)
def edit_credential(account_id, item_id):
    data = request.get_json()
    base_url = get_base_url(request)

    validation_result = are_parameters_valid(data, _credential_modify_params)
    if not validation_result.is_valid:
        return (jsonify(validation_result.error_msgs), StatusCode.BAD_REQUEST.value)

    updated = cloud_sql.update_item(
        item_id, account_id, data["kid"], data["enc"], data["overview"], data["details"]
    )

    if updated[0] is True:
        return (
            jsonify(
                {
                    "id": item_id,
                    "self": f"{base_url}/api/v1/accounts/{account_id}/items/{updated[1]}",
                }
            ),
            StatusCode.OK.value,
        )
    else:
        return (jsonify(updated[1]), StatusCode.BAD_REQUEST.value)


@credentials_blueprint.route(
    f"{BASE_PATH}/<account_id>/items/<item_id>", methods=["DELETE"]
)
def delete_credential(account_id, item_id):
    deleted = cloud_sql.delete_item(account_id, item_id)

    if deleted[0] is True:
        return ({}, StatusCode.NO_CONTENT.value)
    else:
        return (jsonify(deleted[1]), StatusCode.NOT_FOUND.value)
