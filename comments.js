// Create web server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

// Use body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up server
var server = app.listen(8080, function() {
    console.log('Server is running on port 8080');
});

// Set up socket
var io = require('socket.io').listen(server);

// Set up comments
var comments = [];
var commentsPath = path.join(__dirname, 'comments.json');

// Load comments from file
fs.readFile(commentsPath, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        comments = JSON.parse(data);
    }
});

// Set up routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', function(req, res) {
    res.json(comments);
});

app.post('/comments', function(req, res) {
    var comment = req.body;
    comments.push(comment);

    fs.writeFile(commentsPath, JSON.stringify(comments), function(err) {
        if (err) {
            console.log(err);
        } else {
            io.emit('comment', comment);
            res.json(comments);
        }
    });
});

// Set up socket
io.on('connection', function(socket) {
    console.log('A user connected');
});