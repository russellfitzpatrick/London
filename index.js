// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/ideaDB', { useMongoClient: true }); //Connects to a mongo database called "commentDB"

var ideaSchema = mongoose.Schema({ //Defines the Schema for this database
    idea: String,
    name: String,
    upvotes: Number
});

var Idea = mongoose.model('Idea', ideaSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

ideaSchema.methods.upvote = function(cb) { this.upvotes += 1; this.save(cb); };

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
var router = express.Router();
app.use(express.static(path.join(__dirname, 'public')));

router.get('/idea', function(req, res, next) {
    Console.log("in it");
    Idea.find(function(err, ideas){
        if(err){ return next(err); }
        res.json(ideas);
    });
});

router.post('/ideas', function(req, res, next) {
    Console.log("in it");
    var idea = new Idea(req.body);
    idea.save(function(err, idea){
        if(err){ return next(err); }
        res.json(ideas);
    });
});

router.param('idea', function(req, res, next, id) {
    Console.log("in it");
    var query = Idea.findById(id);
    query.exec(function (err, idea){
        if (err) { return next(err); }
        if (!idea) { return next(new Error("can't find comment")); }
        req.idea = idea;
        return next();
    });
});

router.get('/ideas/:idea', function(req, res) {
    Console.log("in it");
    res.json(req.idea);
});

router.put('/ideas/:idea/upvote', function(req, res, next) {
    Console.log("in it");
    req.idea.upvote(function(err, idea){
        if (err) { return next(err); }
        res.json(idea);
    });
});

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {

    // when the client emits 'new message', this listens and executes
    socket.on('idea posted', function (data) {
        // we tell the client to execute 'new message'
        Console.log('idea posted socket');
        socket.broadcast.emit('new idea', data);
    });

    socket.on('idea upvoted', function (data) {
        // we tell the client to execute 'new message'
        Console.log('idea upvoted socket');
        socket.broadcast.emit('new upvote', data);
    });
});
