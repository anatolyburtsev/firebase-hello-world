import time
from firebase_admin import db, initialize_app
from firebase_functions import https_fn, options
import json
from typing import Any
from urllib.parse import urlparse
import re
import logging


initialize_app()

class ListingIdExtractionStatus:
    OK = "OK"
    FAILED = "FAILED"

@https_fn.on_call()
def extract_listing_id_function(req: https_fn.CallableRequest) -> Any:
    """Extract the listing ID from an Airbnb URL."""

    url = req.data['url']

    if not url:
        return {"status": ListingIdExtractionStatus.FAILED, "listing_id": None}

    try:
        parsed_url = urlparse(url)
        path = parsed_url.path

        match = re.search(r'/rooms/(\d+)', path)
        if match:
            listing_id = match.group(1)
            logging.info(f"Extracted ID: {listing_id}")
            return {"status": ListingIdExtractionStatus.OK, "listing_id": str(listing_id)}
        else:
            return {"status": ListingIdExtractionStatus.FAILED, "listing_id": None}

    except Exception as e:
        logging.error(f"Error extracting listing ID: {str(e)}")
        return {"status": ListingIdExtractionStatus.FAILED, "listing_id": None}
