'use strict';

var StatusService = require('../services/statusService');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            const payload = request.payload;
            if(isRegistered(payload.prefix)){
                reply('Is already registered');
            } else {
                addNewRoute(payload);
                StatusService.setNewTentacle(payload);
                reply('registration successful');
            }
        } 
    });

    next();

    function isRegistered(prefix){
        return server.table()[0].table.filter(function (route) {
            return route.path === prefix + '/{param*}';
        }).length > 0;

    }

    function addNewRoute(payload) {
        server.route({
            method: ['*', 'GET'],
            path: payload.prefix + '/{param*}',
            handler: function (request, reply) {
                return reply.proxy({host: payload.host, port: payload.port, protocol: 'http'});
            }
        });
    }
};

exports.register.attributes = {
    name: 'registerNewService',
    version: '0.0.1'
};

