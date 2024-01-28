from collections import namedtuple
from typing import List
from enum import Enum

Param = namedtuple("Param", ["name", "type"])
ParamValidation = namedtuple("ParamValidation", ["is_valid", "error_msgs"])
BASE_PATH = "/api/v1/accounts"


def are_parameters_valid(data: dict, expected_params: List[Param]) -> ParamValidation:
    if not data:
        return ParamValidation(False, ["No params found."])

    error_msgs = []
    for param in expected_params:
        if param.name not in data or not isinstance(data[param.name], param.type):
            msg = f"Expected '{param.name}' of type '{param.type.__name__}' to be included in request."
            error_msgs.append(msg)

    is_valid = True if error_msgs == [] else False
    return ParamValidation(is_valid, {"Error": error_msgs})


def get_base_url(request):
    return request.url_root.rstrip("/")


class StatusCode(Enum):
    OK = 200
    CREATED = 201
    NO_CONTENT = 204
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    NOT_ACCEPTABLE = 406
    NOT_FOUND = 404
