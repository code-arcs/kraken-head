'use strict';

var StatusService = require('../services/statusService');

exports.register = function (server, options, next) {
    var routes = {};

    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            const payload = request.payload;
            if (isRegistered(payload.prefix)) {
                reply('Is already registered');
            } else {
                addNewRoute(payload);
                StatusService.setNewTentacle(payload);
                reply('registration successful');
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/unregister',
        handler: function (request, reply) {
            const payload = request.payload;
            if (isRegistered(payload.prefix)) {
                delete routes[prefix.split('/')[1]];
                reply('unregistered service');
            }
        }
    });

    server.route({
        method: ['*', 'GET'],
        path: '/{service}/{params?}',
        handler: function (request, reply) {
            var proxyInfo = routes[request.params.service];

            if (proxyInfo) {
                return reply.proxy(proxyInfo);
            } else {
                reply(404);
            }
        }
    });

    next();

    function isRegistered(prefix) {
        return !!routes[prefix.split('/')[1]];
    }

    function addNewRoute(payload) {
        routes[payload.prefix.split('/')[1]] = {
            host: payload.host,
            port: payload.port,
            protocol: 'http'
        };

    }
};

exports.register.attributes = {
    name: 'registerNewService',
    version: '0.0.1'
};

