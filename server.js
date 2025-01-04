const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Use express for serving static files and handling requests
app.use(express.json());
app.use(express.static('public'));

// POST endpoint to send a custom message to a specific randomstring group
app.post('/message/:randomstring', (req, res) => {
  const { randomstring } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // In your case, you would broadcast the message to your SSE endpoint here.
  // Since SSE is handled by Vercel's Edge functions, this message could be
  // sent to that endpoint via an HTTP request or some other mechanism if needed.
  
  // Example: You could implement broadcasting to a specific group like this:
  // broadcastToGroup(randomstring, { message, timestamp: new Date() });

  res.status(200).json({ status: `Message sent to clients in group ${randomstring}` });
});

// Serve the main index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the messaging page (optional, if you have a dedicated messaging page)
app.get('/:randomstring', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'message.html'));
});

// Start the server for local development
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// const express = require('express');
// const app = express();
// const path = require('path');
// const port = 3000;

// app.use(express.json());
// app.use(express.static('public'));

// // Store clients grouped by randomstring
// const eventClients = {};

// // Function to send a message to all clients in a group
// function broadcastToGroup(randomstring, message) {
//   const group = eventClients[randomstring] || [];
//   group.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
// }

// // Function to broadcast the client count to all clients in a group
// function broadcastClientCount(randomstring) {
//   const clientCount = eventClients[randomstring]?.length || 0;
//   broadcastToGroup(randomstring, { clientCount });
// }

// // SSE Endpoint for a specific randomstring
// app.get('/events/:randomstring', (req, res) => {
//   const { randomstring } = req.params;

//   // Set up headers for SSE
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   // Initialize the group if not already present
//   if (!eventClients[randomstring]) {
//     eventClients[randomstring] = [];
//   }

//   // Add client to the group
//   eventClients[randomstring].push(res);

//   // Send updated client count to all clients in the group
//   broadcastClientCount(randomstring);

//   // Send keep-alive comments
//   const keepAliveInterval = setInterval(() => {
//     res.write(': keep-alive\n\n');
//   }, 30000);

//   // Clean up when the client disconnects
//   req.on('close', () => {
//     clearInterval(keepAliveInterval);
//     eventClients[randomstring] = eventClients[randomstring].filter(client => client !== res);
//     broadcastClientCount(randomstring);
//     console.log(`Client disconnected from ${randomstring}. Active clients: ${eventClients[randomstring]?.length}`);
//     if (eventClients[randomstring]?.length === 0) {
//       delete eventClients[randomstring]; // Cleanup empty groups
//     }
//   });

//   console.log(`New client connected to ${randomstring}. Active clients: ${eventClients[randomstring]?.length}`);
// });

// // POST endpoint to send a custom message to a specific randomstring group
// app.post('/message/:randomstring', (req, res) => {
//   const { randomstring } = req.params;
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message content is required' });
//   }

//   if (!eventClients[randomstring] || eventClients[randomstring].length === 0) {
//     return res.status(404).json({ error: 'No active clients for this event group' });
//   }

//   broadcastToGroup(randomstring, { message, timestamp: new Date() });
//   res.status(200).json({ status: `Message sent to clients in group ${randomstring}` });
// });

// // Serve the main index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Serve the messaging page
// app.get('/:randomstring', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'message.html'));
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });