from typing import Any

from firebase_admin import initialize_app
from firebase_functions import https_fn, options

ALLOWLIST = ["testuser@example.com"]

initialize_app()

class QueryProcessingStatus:
    OK = "OK"
    FAILED = "FAILED"

@https_fn.on_call(memory=options.MemoryOption.MB_256,
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post", "options"]))
def answer_legal_question(req: https_fn.CallableRequest) -> Any:
    query = req.data['query']

    if not req.auth or not req.auth.token or 'email' not in req.auth.token:
        return {"status": QueryProcessingStatus.FAILED, "response": "Unauthorized access, email not found."}

    user_email = req.auth.token['email']

    if not user_email in ALLOWLIST:
        return {"status": QueryProcessingStatus.FAILED, "response": "Unauthorized access, user not allowlisted."}

    return {"status": QueryProcessingStatus.OK, "response": f"{query=}  {user_email=}"}

import time
from flask import Response

def stream_data():
    # Generator function to stream data in chunks
    def generate():
        data_chunks = ["Chunk 1: Hello", "Chunk 2: This is", "Chunk 3: a streaming", "Chunk 4: response!"]
        for chunk in data_chunks:
            yield f"{chunk}\n"  # Sending data as chunks
            time.sleep(1)  # Simulating delay between chunks
        yield "End of stream\n"

    return Response(generate(), mimetype="text/plain")

# Firebase Function
def stream_function_v2(request):
    # Respond to any incoming request
    return stream_data()

@https_fn.on_request()
def callable_function(request):
    return stream_function_v2(request)