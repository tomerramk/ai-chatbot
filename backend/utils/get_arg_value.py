import os
import argparse

parser = argparse.ArgumentParser(description="Chatbot Server Arguments")
parser.add_argument("--port", type=int, help="Port number for the WebSocket server")
parser.add_argument("--model", type=str, help="Model name for the chatbot")
parser.add_argument("--token", type=str, help="Hugging Face access token")
args, unknown = parser.parse_known_args()

def get_arg_value(arg_name: str, prompt: str, env_var: str = None) -> str:
    """
    Get the value for a given argument based on the following preference order:
    1. Environment variable (optional, passed as `env_var`).
    2. Command-line argument (passed via `--<arg_name>`).
    3. User input (prompted if neither of the above is available).

    :param arg_name: The name of the argument (e.g., 'port', 'model').
    :param prompt: The prompt to ask the user for input if the argument is not available.
    :param env_var: The environment variable name to check (optional).
    :return: The resolved argument value.
    """
    if env_var:
        value_from_env = os.getenv(env_var)
        if value_from_env:
            return value_from_env

    value_from_args = getattr(args, arg_name, None)
    if value_from_args is not None:
        return str(value_from_args)

    return input(prompt).strip()
