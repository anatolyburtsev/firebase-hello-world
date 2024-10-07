import time
from firebase_admin import db, initialize_app
from firebase_functions import https_fn, options
import json
from typing import Any
from urllib.parse import urlparse
import re
import logging

ALLOWLIST = ["FILL_ME"]

initialize_app()

class QueryProcessingStatus:
    OK = "OK"
    FAILED = "FAILED"

@https_fn.on_call()
def answer_legal_question(req: https_fn.CallableRequest) -> Any:
    query = req.data['query']

    if not req.auth or not req.auth.token or 'email' not in req.auth.token:
        return {"status": QueryProcessingStatus.FAILED, "response": "Unauthorized access, email not found."}

    user_email = req.auth.token['email']

    if not user_email in ALLOWLIST:
        return {"status": QueryProcessingStatus.FAILED, "response": "Unauthorized access, user not allowlisted."}

    return {"status": QueryProcessingStatus.OK, "response": f"{query=} {user_email=}"}
