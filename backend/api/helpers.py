from collections import namedtuple
from typing import List

Param = namedtuple("Param", ["name", "type"])
BASE_PATH = "/api/v1/accounts"


def are_parameters_valid(data: dict, expected_params: List[Param]) -> bool:
    if not data:
        return False

    for param in expected_params:
        if param.name not in data or not isinstance(data[param.name], param.type):
            return False

    return True


def get_base_url(request):
    return request.url_root.rstrip("/")
