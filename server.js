const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// List of connected clients
let clients = [];

// Function to send a message to a single client
function sendToClient(client, message) {
  client.write(`data: ${JSON.stringify(message)}\n\n`);
}

// SSE Endpoint for the client to connect
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add client to the list
  clients.push(res);

  // Send a keep-alive comment every 30 seconds to prevent timeout
  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n'); // Keep-alive comment ignored by the client
  }, 30000);

  // Broadcast the updated client count to all clients
  const broadcastClientCount = () => {
    const clientCount = clients.length;
    clients.forEach(client => sendToClient(client, { clientCount }));
  };

  // Notify all clients about the new client count
  broadcastClientCount();

  // Clean up when the client disconnects
  req.on('close', () => {
    clearInterval(keepAliveInterval);
    clients = clients.filter(client => client !== res);
    broadcastClientCount();
    console.log('Client disconnected. Active clients:', clients.length);
  });

  console.log('New client connected. Active clients:', clients.length);
});

// POST endpoint to send a custom message to all connected clients
app.post('/message', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // Broadcast message to all connected clients
  clients.forEach(client => sendToClient(client, { message, timestamp: new Date() }));

  res.status(200).json({ status: 'Message sent to all clients' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
