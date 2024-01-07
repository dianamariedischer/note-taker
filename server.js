// Import express package
const express = require('express');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');
const fs = require('fs');
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

// GET request handler for note db
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

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    const id = notes.length + 1;
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    
    // If all the required properties are present
    // validating if the user entered all fields
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            id,
            title,
            text,
        };

        //const notesArray = JSON.parse(notes);
        notes.push(newNote);
    
        const notesString = JSON.stringify(notes);
        // Write the stringified array with the added note to the db file
        fs.writeFile(`./db/db.json`, notesString, (err) =>
            err
            ? console.error(err)
            : console.log(
                `${newNote.title} has been written to JSON file`
            )
        );


        // res.json() returns data including a status message indicating the success of the request along with the newly created review data.
        // 201 is a success response for something created, and res.json sends the success message back to the client
        res.status(201).json(newNote);
    } else {
        // the purpose of the else statement is to allow a way to throw an error if either the product, review, or username is not present.
        // 500 response for something is wrong, and we send back a non-specific error to let the client there was a problem in the data in some way.
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {

    notes.splice(req.params.id - 1, 1);

    for (i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
    }

    const notesString = JSON.stringify(notes);
    // Write the new stringified array to the db file
    fs.writeFile(`./db/db.json`, notesString, (err) =>
        err
        ? console.error(err)
        : console.log(
            `The note has been deleted.`
        )
    );
    res.status(200).json(req.params.id);
});

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
