import logging
import os

FILE_NAME = "chat_server.log"

# Configure logger
logger = logging.getLogger("chat_server")
logger.setLevel(logging.INFO)

# Delete the existing log file if it exists
if os.path.exists(FILE_NAME):
    os.remove(FILE_NAME)

# Create file handler
file_handler = logging.FileHandler(FILE_NAME)
file_handler.setLevel(logging.INFO)

# Create console handler (logs to terminal)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Create formatter and add it to handlers
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)