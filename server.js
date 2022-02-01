// imported and required packages
var express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const shortUID = require('short-unique-id');

const PORT = process.env.PORT || 3000;

// Creates an express application
const app = express();

// Middleware
// a method to recognize incoming request objects as JSON objects, 
app.use(express.json());
// a method to recognize incoming request objects as strings or arrays
app.use(express.urlencoded({ extended: true }));
// Allows us to serve static files such as index.html and notes.html
app.use(express.static('public'));

const uid = new shortUID({ length: 5 });

// Allows the JSON file to be readable
const readFromFile = util.promisify(fs.readFile);

// function that writes to a specific location with the contents
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.log(err) : console.log(`Data writtne to ${destination}`)
    );

// Reads a file and appends data
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};



// GET route for homepage
// Sets the current webpage to index.html upon visit
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for the notes page
// Redirects from the home page to notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to read the db.json file and return the saved notes as JSON
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => {
        console.log(JSON.parse(data));
        res.JSON(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if(req.body) {
        const newNote = {
            title,
            text,
            id: uid(),
        }
        readAndAppend(newNote, './db/db.json');
        res.json("Saved note.");
    } else {
        res.error('Not has not been saved. Please try again.');
    }
});

// listener for the port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));