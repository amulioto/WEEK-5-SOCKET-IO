const setupSocket = (io) => {
  // Create separate namespaces
  const chatNamespace = io.of('/chat');
  const notificationNamespace = io.of('/notifications');

  // Authentication middleware for both namespaces
  const verifyToken = require('./authHandlers').verifyToken;
  chatNamespace.use(verifyToken);
  notificationNamespace.use(verifyToken);

  // Setup handlers for each namespace
  chatNamespace.on('connection', (socket) => {
    require('./roomHandlers')(chatNamespace, socket);
    require('./messageHandlers')(chatNamespace, socket);
    require('./fileHandlers')(chatNamespace, socket);
  });

  notificationNamespace.on('connection', (socket) => {
    require('./notificationHandlers')(notificationNamespace, socket);
  });

  // Health check endpoint
  io.of('/').on('connection', (socket) => {
    socket.on('ping', (cb) => cb('pong'));
  });
};