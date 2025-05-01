const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (if you have an HTML frontend)
app.use(express.static('public'));

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Listen on the port Render assigns or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
