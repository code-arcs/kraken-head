'use strict';

const Hapi = require('hapi');

var StatusService = require('./services/statusService');

const server = new Hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: 3000,
    labels: ['api']
});

server.connection({
    host: '0.0.0.0',
    port: 3001,
    labels: ['status']
});

const api = server.select('api');

server.register(require('h2o2'),  (err) => {
    if (err) {
        console.error('Failed to load h2o2');
    }
});

server.register(require('./plugin/registerNewTentacle.js'), (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});

server.register(require('./plugin/statusChanged.js'), function (err) {
    if (err) {
        console.error('Failed to load statusChanged plugin');
    }
});

server.register(require('inert'), function (err){
    if (err){
        console.error('Failed to load inert plugin');
    }

    api.route({
        method: 'GET',
        path: '/{param*}',
        config: {
            auth: false,
            handler: {
                directory: {
                    path: 'view',
                    listing: true
                }
            }
        }
    });
});

api.route({
    method: 'GET',
    path: '/status',
    handler: function (request, reply) {
        reply(StatusService.getAllTentacles());
    }
});

server.start(() => {
    console.log('Server running at:', api.info.uri);
});