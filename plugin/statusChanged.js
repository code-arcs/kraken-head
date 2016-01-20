exports.register = function (server, options, next) {
    var io = require('socket.io')(server.select('status').listener);
    var Handlers = require('./../services/socketService')(io);

    io.on('connection', function () {
        Handlers.emitAllStates();
    });

    next();
};

exports.register.attributes = {
    name: 'status-changed'
};