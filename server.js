const express = require('express');
const fs = require('fs');
const db = require('./db/db.json')
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routing:
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

// API Routing
app.get("/api/notes", function (req, res) {
    return res.json(db);
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    newNote.id = new Date().getTime().toString();
    db.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    return res.json(newNote);
});

app.delete('/api/notes/:id', function (req, res){
    const id = req.params.id;
    const index = db.findIndex(function (note){
        return note.id === id;
    })
    if (index !== -1){
        db.splice(index, 1)
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    return res.json(id);
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
// Listen on PORT:
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});