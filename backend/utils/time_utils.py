import datetime
import pytz

ISRAEL_TZ = pytz.timezone("Asia/Jerusalem")

def get_timestamp() -> str:
    """Returns the current UTC timestamp in ISO format with timezone awareness."""

    return datetime.datetime.now(ISRAEL_TZ).isoformat()
