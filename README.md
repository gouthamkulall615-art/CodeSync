

Readme · MD
# CodeSync
 
CodeSync is a real-time collaborative code editor that allows multiple users to work on the same code simultaneously.
 
The project uses React, Monaco Editor, Yjs, y-monaco, Socket.IO, and y-socket.io to provide real-time synchronization between connected users.
 
## Features
 
- Real-time collaborative code editing
- Monaco Editor integration
- Multiple users can edit the same document
- Real-time synchronization using Yjs
- WebSocket communication using Socket.IO
- User name based joining
- JavaScript syntax highlighting
- VS Code-like editing experience
- React frontend
- Node.js and Express backend
- Production build support
- Docker-ready project structure
## Tech Stack
 
### Frontend
 
- React
- Vite
- Monaco Editor
- Yjs
- y-monaco
- y-socket.io
- Socket.IO Client
- CSS
### Backend
 
- Node.js
- Express
- Socket.IO
- y-socket.io
- dotenv
## Project Structure
 
```text
CodeSync/
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
│   │   ├── main.jsx
│   │   └── monaco.js
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
 
## How It Works
 
CodeSync uses Yjs as the underlying synchronization layer.
 
```text
User 1
   |
   v
Monaco Editor
   |
y-monaco
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
 
When one user modifies the document, Yjs creates a synchronized update. The update is transmitted through the WebSocket connection and applied to the other connected clients.
 
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
cd CodeSync
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
 
CodeSync currently requires the backend and frontend development servers to run separately.
 
### Start the Backend
 
Open a terminal:
 
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
 
### Start the Frontend
 
Open another terminal:
 
```bash
cd Frontend
npm run dev
```
 
The frontend should start on:
 
```text
http://localhost:5173
```
 
Open the URL in your browser.
 
## Testing Collaboration
 
1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:5173`.
4. Enter a username.
5. Open another browser window or incognito window.
6. Enter another username.
7. Edit the code from either window.
8. Changes should synchronize between the connected clients.
Both users currently connect to the same collaborative room:
 
```text
codesync-room
```
 
Room management can be extended later to support multiple independent sessions.
 
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
 
The production files are generated inside:
 
```text
Frontend/dist/
```
 
The project can be configured to serve the frontend production build from the Express backend.
 
The current backend contains a `public` directory intended for serving frontend production assets.
 
## Docker
 
The project contains a Dockerfile for containerized deployment.
 
Build the image:
 
```bash
docker build -t codesync .
```
 
Run the container:
 
```bash
docker run -p 5000:5000 codesync
```
 
The exact Docker configuration may need to be adjusted depending on the final production architecture.
 
## Architecture
 
CodeSync consists of two primary applications.
 
### Frontend
 
The frontend is responsible for:
 
- User interface
- User name input
- Monaco Editor
- Yjs document creation
- Monaco-Yjs binding
- WebSocket connection
- Real-time document updates
### Backend
 
The backend is responsible for:
 
- Express HTTP server
- Static file serving
- Socket.IO server
- y-socket.io synchronization
- WebSocket connections
- Collaborative session communication
## Current Limitations
 
The current version is an early collaborative editor implementation.
 
Current limitations include:
 
- A single hard-coded collaboration room
- No authentication system
- No persistent document storage
- No user accounts
- No file/folder management
- No code execution sandbox
- No database integration
- Limited user presence functionality
- Development CORS configuration
- Production deployment configuration still needs refinement
## Future Improvements
 
Planned improvements include:
 
### Collaboration
 
- Multiple rooms
- Room creation and joining
- User presence
- User cursors
- User colors
- Active participant list
- Room permissions
### Authentication
 
- User registration
- Login
- OAuth
- Protected rooms
- User profiles
### Code Editor
 
- Multiple programming languages
- File explorer
- Multiple files
- Tabs
- Themes
- Editor settings
- IntelliSense improvements
### Code Execution
 
- C
- C++
- Java
- Python
- JavaScript
- Other supported languages
Code execution should be isolated inside containers or another secure sandbox rather than executed directly on the application server.
 
### Storage
 
- Persistent documents
- Project storage
- User projects
- Version history
- Autosave
### Deployment
 
- Docker
- Production WebSocket configuration
- HTTPS
- Environment-specific configuration
- CI/CD
- Cloud deployment
## Security Considerations
 
CodeSync should not execute arbitrary user-submitted code directly on the backend server.
 
A production code execution system should use isolated containers or a dedicated sandbox with:
 
- CPU limits
- Memory limits
- Execution timeouts
- Network restrictions
- Filesystem isolation
- Process limits
- Resource quotas
Authentication and authorization should also be implemented before exposing private collaborative rooms publicly.
 
## Development Workflow
 
Recommended development workflow:
 
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
 
During development, keep the frontend and backend running separately.
 
## Contributing
 
1. Fork the repository.
2. Create a new branch.
```bash
git checkout -b feature/your-feature
```
 
3. Make your changes.
4. Test the application.
5. Commit your changes.
```bash
git add .
git commit -m "Add your feature"
```
 
6. Push the branch.
```bash
git push origin feature/your-feature
```
 
7. Create a pull request.
## License
 
This project is currently intended for educational and development purposes.
 
A formal open-source license can be added later.
 
## Author
 
Goutham M
 
GitHub:
 
<your-github-profile-url>
## Project Status
 
CodeSync is currently under active development.
 
The core real-time collaborative editor is being developed first, followed by authentication, project management, secure code execution, persistence, and production deployment.
 

