// import express package
const express = require('express');

// importing 'path' - a node.js package that resolves the path of files on the server
const path = require('path');
// import file system to write over the notes db.json file
const fs = require('fs');
// notes variable that points to the location of the db.json file
// allows easy edits to the array containing note objects
const notes = require('./db/db.json');

// specify which port Express.js server will run on
const PORT = 3001;

// app variable initialized and set to express()
const app = express();

// take in json type data
app.use(express.json());

// static middleware that points to the public folder
app.use(express.static('public'));

// GET route that sends the index html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// GET route that sends the html for the notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// GET request handler for note db
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    // status 200 is a successful get, returns the content of notes in json
    res.status(200).json(notes);
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Logs that POST request was receieved
    console.info(`${req.method} request received to add a note`);
  
    // new note id to put it at the end of the array
    const id = notes.length + 1;
    // Destructuring for the items in req.body / the note being added
    const { title, text } = req.body;
    
    // make sure all the required properties are present
    if (title && text) {
        // create new note object
        const newNote = {
            id,
            title,
            text,
        };

        // add the new note to the end of the notes array file
        notes.push(newNote);

        const notesString = JSON.stringify(notes);
        // Write the new stringified array to the db file
        fs.writeFile(`./db/db.json`, notesString, (err) =>
            err
            ? console.error(err)
            : console.log(
                `${newNote.title} has been written to JSON file`
            )
        );

        // send status indicating a successful post and the content of the note added
        res.status(201).json(newNote);
    } else {
        // log an error if required properties are not present
        res.status(500).json("Error in posting note, make sure you've input all necessary data");
    }
});

app.delete('/api/notes/:id', (req, res) => {
    // check to make sure there is a note item with that id
    if(notes[req.params.id - 1]){
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
                    `Note ${req.params.id} has been deleted.`
                )
        );
        // send status indicating a successful delete and return the id
        res.status(204).json(req.params.id);
    } else {
        // log an error if required properties are not present
        res.status(500).json("No note found with the selected id");
    }
    
});

// liaten for incoming connections on the specified port and log which port is being used
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
