// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var port = process.env.PORT || 3007;
//socket = require('./sockets/base.js');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/ideaDB', { useMongoClient: true }); //Connects to a mongo database called "commentDB"

var ideaSchema = mongoose.Schema({ //Defines the Schema for this database
    idea: String,
    name: String,
    upvotes: {type: Number, default: 0},
});
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

ideaSchema.methods.upvote = function(cb) { this.upvotes += 1; this.save(cb); };
var Idea = mongoose.model('Idea', ideaSchema);

// Routing

app.use(express.static(path.join(__dirname, 'public')));

app.get('/ideas', function(req, res, next) {
    Idea.find(function(err, ideas){
        if(err){ return next(err); }
        console.log("Getting Ideas");
        res.json(ideas);
    });
});

app.post('/ideas', function(req, res, next) {
    var idea = new Idea(req.body);
    idea.save(function(err, idea){
        if(err){ return next(err); }
        console.log("Idea:" + idea);
        console.log("Posting idea");
        res.json(idea);
    });
});

app.param('idea', function(req, res, next, id) {
    var query = Idea.findById(id);
    query.exec(function (err, idea){
        if (err) { return next(err); }
        if (!idea) { return next(new Error("can't find comment")); }
        req.idea = idea;
        return next();
    });
});

app.get('/ideas/:idea', function(req, res) {
    res.json(req.idea);
});

app.put("/ideas/:idea/upvote", (req, res, next) => {
    req.idea.upvote(function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
});
});

//io.sockets.on('connection', socket);

io.sockets.on('connection', function (socket) {

	socket.emit('update', {name: 'update'});
	console.log("Connected socket");
socket.on('disconnect', function () {
       console.log('user disconnected');
    });
    socket.on('update', function (data) {
        console.log(data);
        socket.broadcast.emit('update', {name: 'update'});
	console.log("Emit sent");
    });
});

// server.listen(3008, function () {
//     console.log('Server listening at port %d', port);
// });

//app.listen(port, function () {
//    console.log('Server listening at port %d', port);
//});

server.listen(port); 
