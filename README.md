# AI Chatrooom

AI Chatroom is a real-time chat application with support for multiple AI personalities, powered by a Python websockets server and a Vite-based React frontend.

## Features

- **Custom AI models** - Supports choosing different AI models.
- **Websocket backend** - Real-time messaging via sockets
- **Multiple AI presonalities** - Users can select different AI personas.
- **Conversation history** - The AI respondes according to previous messages in session.
- **User count** - Displays the number of connected users using the chat.
- **Dark/Light mode**

## Prerequisites

- Python 3.10 or above
- Npm
- Node.js

## Getting Started

## Installation

### Backend (Python websockets)

### Running locally

1. Navigate to the backend directory
   ```pwsh
   cd backend
   ```
2. Install dependencies
   ```pwsh
   pip install -r requirements.txt
   ```
3. Run the backend server
   ```pwsh
   python main.py
   ```

### Building Executable

(Takes around 5 minutes)

1.  Navigate to the backend directory

    ```pwsh
    cd backend
    ```

2.  Obfuscate with pyarmor

    ```pwsh
    pyarmor gen -O dist -r config logs models utils workers main.py
    ```

3.  Navigate to the dist directory

    ```pwsh
    cd dist
    ```

4.  Package with pyinstaller
    ```pwsh
     pyinstaller --onefile --name server --hidden-import=asyncio --hidden-import=websockets --hidden-import=dotenv --hidden-import=transformers --hidden-import=pytz
    --add-data config/*.py:config --add-data logs/*.py:logs --add-data models/*.py:models --add-data utils/*.py:utils --add-data workers/*.py:workers main.py
    ```

### Making Changes

The backend uses local dynamic hash verification for obfuscated exe, so after making changes to `main.py` the hash needs to be generated again and replaced in `verify.py` before running the build commands.

```pwsh
certutil -hashfile main.py SHA256
```

## Frontend (Vite + React)

### Running Locally

1. Navigate to the frontend directory

   ```pwsh
   cd frontend
   ```

2. Install dependencies

   ```pwsh
   npm install
   ```

3. Run the Frontend

   ```pwsh
   npm run dev
   ```

The Application will become available at `localhost:3000`

### Building Executable

(Takes around a minute)

1. Build the frontend and obfuscate with `javascript-obfuscator`

   ```pwsh
   npm run build
   ```

2. Package with Electron
   ```pwsh
   npm run package
   ```
   The packed application will be located under `frontend/release-builds`
