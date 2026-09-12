# SyncCanvas

**SyncCanvas** is a real-time collaborative workspace where multiple users connect to the same session and see each other's changes synchronized instantly. It is built on a CRDT-based synchronization engine (Yjs) running over WebSockets, providing conflict-free, low-latency collaboration between connected clients.

This project began as a real-time collaborative code editor and has since evolved into a real-time collaborative canvas application, reusing its core synchronization engine as the foundation.

## Overview

SyncCanvas demonstrates a full-stack, event-driven architecture centered on persistent WebSocket connections rather than traditional request/response REST patterns. The application shell — authentication, room/session management, and real-time synchronization — is fully implemented and working. Canvas-specific functionality (drawing, shapes, tools) is the current focus of active development, built on top of this existing foundation.

## Features

**Currently implemented:**
- User authentication (auth pages and backend auth/database code)
- Room joining via room/PIN URL parameter
- Dashboard and room-related UI and routes
- Real-time collaborative session synchronization
- Multiple users can join and interact within the same session simultaneously
- Conflict-free synchronization using Yjs (CRDT-based)
- Active peer list using Yjs awareness
- WebSocket communication via Socket.IO
- Username-based user flow
- React frontend with Vite
- Node.js and Express backend
- Production build support
- Docker-ready project structure
- Workspace screen with a "Canvas coming soon" placeholder

**Not yet implemented:**
- Canvas and drawing functionality
- Shapes, tools, selection, zoom, and pan
- Whiteboard logic
- Persistence for canvas/document content

**Intentionally out of scope (carried over from a prior iteration, not part of this project):**
- Monaco / code editor
- Code execution or terminal output

## Tech Stack

### Frontend
- React
- Vite
- Yjs
- y-socket.io
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express
- Socket.IO
- y-socket.io
- dotenv

## Architecture

SyncCanvas consists of two primary applications communicating over a persistent WebSocket connection.

```text
User 1
   |
   v
Canvas (in development)
   |
Yjs Document
   |
y-socket.io
   |
Socket.IO
   |
Node.js Backend
   |
   +----------------+
   |                |
   v                v
User 2           User 3
```

When one user modifies shared state, Yjs generates a synchronized update. The update is transmitted through the WebSocket connection and applied to all other connected clients in real time.

### Frontend responsibilities
- User interface
- Username input and session joining
- Canvas rendering (in development)
- Yjs document creation and binding
- WebSocket connection management
- Real-time state updates

### Backend responsibilities
- Express HTTP server
- Static file serving
- Socket.IO server
- y-socket.io synchronization
- WebSocket connection handling
- Collaborative session communication

## Project Structure

```text
SyncCanvas/
│
├── Backend/
│   ├── public/
│   │   ├── assets/
│   │   └── index.html
│   │
│   ├── .config.env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   └── App.css
│   │   │
│   │   └── main.jsx
│   │
│   ├── dist/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── dockerfile
└── README.md
```

## Prerequisites

Make sure the following are installed:
- Node.js
- npm
- Git

Check your installations:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd SyncCanvas
```

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Environment Configuration

The backend uses a `.config.env` file.

Example:

```env
PORT=5000
```

Do not commit environment files containing secrets.

The backend `.gitignore` should contain:

```gitignore
.config.env
node_modules/
```

## Running the Application

SyncCanvas currently requires the backend and frontend development servers to run separately.

### Start the backend

```bash
cd Backend
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

Expected output:

```text
Server is running on port 5000
```

### Start the frontend

Open a second terminal:

```bash
cd Frontend
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

Open the URL in your browser.

## Testing Real-Time Sync

1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:5173` and log in or create an account.
4. Join or create a room (via room/PIN).
5. Open a second browser window or incognito window.
6. Log in with a different account and join the same room.
7. Both windows should show each other in the active peer list.
8. Any real-time state changes should synchronize instantly between connected clients.

## Available Scripts

### Backend

From the `Backend` directory:

```bash
npm run dev
```
Starts the backend using Nodemon.

```bash
npm start
```
Starts the backend using Node.js.

### Frontend

From the `Frontend` directory:

```bash
npm run dev
```
Starts the Vite development server.

```bash
npm run build
```
Creates a production build.

```bash
npm run preview
```
Previews the production build locally.

```bash
npm run lint
```
Runs ESLint.

## Production Build

Build the frontend:

```bash
cd Frontend
npm run build
```

Production files are generated inside `Frontend/dist/`.

The project can be configured to serve the frontend production build directly from the Express backend. The backend's `public` directory is intended for this purpose.

## Docker

The project includes a Dockerfile for containerized deployment.

Build the image:

```bash
docker build -t syncanvas .
```

Run the container:

```bash
docker run -p 5000:5000 syncanvas
```

Exact Docker configuration may need adjustment depending on final production architecture.

## Current Limitations

Canvas functionality is not yet implemented — this is the current focus of active development. Other known limitations include:

- No persistence for canvas/document content once built
- Development-only CORS configuration
- Production deployment configuration not yet finalized

## Future Improvements

### Canvas
- Shape drawing and manipulation tools
- Selection, zoom, and pan
- Multi-user drag/resize with conflict resolution ("last-write-wins" as the initial strategy)
- Shape/document persistence per session

### Collaboration
- Per-user cursor colors on the canvas
- Room permissions

### Storage
- Persistent canvas/document state
- Version history
- Autosave

### Deployment
- Production WebSocket configuration
- HTTPS
- Environment-specific configuration
- CI/CD
- Cloud deployment

## Security Considerations

Authentication and authorization should be implemented before exposing private collaborative rooms publicly. Production deployments should also enforce proper CORS restrictions and rate limiting on socket connections.

## Development Workflow

```text
Frontend Development
        |
        v
npm run build
        |
        v
Frontend/dist
        |
        v
Backend/public
        |
        v
Express
        |
        v
Production Server
```

During development, the frontend and backend run separately.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes.
4. Test the application.
5. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your feature"
   ```
6. Push the branch:
   ```bash
   git push origin feature/your-feature
   ```
7. Open a pull request.

## Project Status

SyncCanvas is under active development. Authentication, room/session management, and the core real-time synchronization engine are complete and functional. Canvas-specific features (drawing, shapes, tools) are the current phase of active work.

## Author

**Goutham M**


## License

This project is currently intended for educational and portfolio purposes. No formal license has been applied.
