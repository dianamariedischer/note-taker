// Import express package
const express = require('express');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');
const notes = require('./db/db.json');

// Specify on which port the Express.js server will run
const PORT = 3001;

// Initialize our app variable by setting it to the value of express()
const app = express();

// take in json type data
app.use(express.json());

// Static middleware pointing to the public folder
// files that are publicly available
app.use(express.static('public'));

// GET route to get all of the notes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// GET request handler for reviews
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    // status 200 is a good/ok response for a successful get
    res.status(200).json(notes);
  });

// GET request for notes
app.get('/notes', (req, res) => {
    // send notes
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
