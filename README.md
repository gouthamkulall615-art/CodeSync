SyncCanvas is currently a bare real-time collaboration shell, ready for canvas development.

It currently includes:

- React + Vite frontend
- Express backend
- Socket.io real-time server/client connection
- Yjs document setup with `y-socket.io` synchronization
- Username-based user flow
- Existing room joining via room/PIN URL parameter
- Active peer list using Yjs awareness
- User authentication pages and existing backend auth/database code
- Dashboard and room-related existing UI/routes
- Docker configuration and deployment notes
- A workspace screen with a simple “Canvas coming soon” placeholder

It does not currently include:

- Canvas or drawing functionality
- Shapes, tools, selection, zoom, pan, or whiteboard logic
- Monaco/code editor
- Code execution or terminal output
- Persistence for canvas/document content
- New authentication or room/PIN systems beyond what already existed
