from collections import namedtuple
from typing import List

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
    return ParamValidation(is_valid, {"errors": error_msgs})


def get_base_url(request):
    return request.url_root.rstrip("/")
