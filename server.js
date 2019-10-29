const express = require('express');
const router = require('./router/db-router.js');
const server = express();

server.use(express.json()); 

server.use('/api/posts', router);

// server.get("/", (req, res) => {
//   res.send(`
//     HELLO THERE
//   `);
// });


module.exports = server;