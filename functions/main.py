import urllib
from typing import Any

import html2text
from google.cloud import storage
from firebase_admin import initialize_app
import os
from firebase_functions import https_fn, options
import logging
from google.cloud import logging as gcp_logging


ALLOWLIST = ["testuser@example.com"]

initialize_app()

logger = logging.getLogger()

def configure_logging():
    # Check if running in GCP or Emulator
    if os.getenv('FUNCTIONS_EMULATOR', None):
        # Running in Emulator, log locally
        logging.basicConfig(level=logging.INFO)
    else:
        # Running in GCP, set up Google Cloud logging
        client = gcp_logging.Client()
        client.setup_logging()

# Call the logging configuration function at the start
configure_logging()

class QueryProcessingStatus:
    OK = "OK"
    FAILED = "FAILED"

@https_fn.on_call(memory=options.MemoryOption.MB_256,
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post", "options"]))
def answer_legal_question(req: https_fn.CallableRequest) -> Any:
    query = req.data['query']

    logger.info(f"{query=}")

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


def generate_file_name_from_url(url: str) -> str:
    """
    Converts a URL into a hierarchical file path for GCS.

    Args:
        url (str): The URL to be converted into a file path.

    Returns:
        str: The hierarchical file path based on the URL structure.
    """
    # Parse the URL
    parsed_url = urllib.parse.urlparse(url)

    # Remove 'https://' and split the URL path into components
    path = parsed_url.path.strip("/")

    # Combine the domain and the path to form a hierarchical structure
    file_path = f"{parsed_url.netloc}/{path}.md"

    return file_path

def convert_html_to_markdown(html_content: str) -> str:
    """
    Converts HTML content to Markdown format.

    Args:
        html_content (str): The HTML content to be converted.

    Returns:
        str: The converted content in Markdown format.
    """
    h = html2text.HTML2Text()
    return h.handle(str(html_content))

# Function to upload the markdown to GCS
def upload_to_gcs(bucket_name: str, file_name: str, content: str):
    """
    Uploads a file to Google Cloud Storage.

    Args:
        bucket_name (str): The GCS bucket name.
        file_name (str): The name of the file to store.
        content (str): The content to be uploaded.
    """
    # Initialize the GCS client
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)

    # Upload the markdown content
    blob.upload_from_string(content)

@https_fn.on_request(memory=options.MemoryOption.MB_512,
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post", "options"]))
def handle_callback(request: https_fn.Request):
    try:
        # Parse the incoming request data
        request_data = request.get_json(silent=True)

        # 1. Check status of the request
        status = request_data.get("status")
        if status != "finished":
            logging.warning(f"Job status is {status}, not finished. request: {request_data}. Exiting.")
            return {"message": "Job not finished yet"}

        # 2. Extract HTML and URL
        html_content = request_data["response"].get("body")
        url = request_data.get("url")

        if not html_content or not url:
            logging.error(f"Missing html content or url: {request_data}")
            return {"error": "HTML content or URL missing."}

        # 3. Convert HTML to Markdown
        markdown_content = convert_html_to_markdown(html_content)

        # 4. Store Markdown to GCS (using URL to create filename)
        file_name = "part2/" + generate_file_name_from_url(url)
        bucket_name = "legal_cases"

        upload_to_gcs(bucket_name, file_name, markdown_content)
        logger.info(f"File {file_name} stored")

        return {"message": f"Markdown content uploaded as {file_name}"}

    except Exception as e:
        logging.error(f"Error processing callback: {str(e)}")
        return {"error": "Internal Server Error"}

