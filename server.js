const express = require('express');
const http = require('http');
const cors = require('cors');
const setupSocket = require('./socket/socketSetup');
const authRoutes = require('./controllers/authController');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Socket.io setup
setupSocket(io);

const fileController = require('./controllers/fileController');

// Add this before socket.io initialization
app.use('/uploads', express.static('public/uploads'));
app.post('/api/upload', fileController.uploadFile);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// In server/server.js
const messageController = require('./controllers/messageController');

// Add these routes
app.get('/api/messages/paginated', messageController.getPaginatedMessages);
app.get('/api/messages/search', messageController.searchMessages);