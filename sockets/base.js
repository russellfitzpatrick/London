module.exports = function(socket) {

    socket.on('update', function (data) {
        console.log(data);
        io.emit('update', {name: 'update'});
    });

};
