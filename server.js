// imported and required packages
var express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Creates an express application
const app = express();

// Allows us to serve static files such as index.html and notes.html
app.use(express.static('public'));

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

// listener for the port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));