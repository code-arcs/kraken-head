'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
        port: 3000
});

server.register({
    register: require('h2o2')
}, function (err) {
    if (err) {
        console.log('Failed to load h2o2');
    }
});

server.register(require('./plugin/registerNewTentacle.js'), (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});


server.start(() => {
    console.log('Server running at:', server.info.uri);
});