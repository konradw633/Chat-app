const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve the full HTML with inline CSS & JS
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Chat App</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          ul { list-style: none; padding: 0; }
          li { padding: 5px 0; }
        </style>
      </head>
      <body>
        <h1>Real-Time Chat</h1>
        <ul id="messages"></ul>
        <input id="input" autocomplete="off" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>

        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          const messages = document.getElementById('messages');
          const input = document.getElementById('input');

          function sendMessage() {
            const msg = input.value.trim();
            if (msg) {
              socket.emit('chat message', msg);
              input.value = '';
            }
          }

          socket.on('chat message', (msg) => {
            const li = document.createElement('li');
            li.textContent = msg;
            messages.appendChild(li);
          });

          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
          });
        </script>
      </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
