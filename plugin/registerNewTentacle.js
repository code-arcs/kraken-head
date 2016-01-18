'use strict';

var StatusService = require('../services/statusService');

exports.register = function (server, options, next) {
    var registeredProxies = new Map();

    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, reply) {
            const payload = request.payload;

            if(registerPayloadIsValid(payload)) {
                if (isRegistered(payload.prefix)) {
                    reply('Is already registered');
                } else {
                    addNewProxy(payload);
                    StatusService.setNewTentacle(payload);
                    console.log(`A new service with prefix ${payload.prefix} has been added!`);
                    reply('Service has been registered!');
                }
            } else {
                reply('Your data is wrong and you should feel wrong!').code(403);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/unregister',
        handler: function (request, reply) {
            const payload = request.payload;
            if(unregisterPayloadIsValid(payload)) {
                if(registeredProxies.delete(payload.prefix.split('/')[1])) {
                    console.log(`Service with prefix ${payload.prefix} has been removed!`);
                    reply('Service has been unregistered!');
                } else {
                    console.log(`Service with prefix ${payload.prefix} could not be removed!`);
                    reply('Error removing service!');
                }
            } else {
                reply('Your data is wrong and you should feel wrong!').code(403);
            }
        }
    });

    server.route({
        method: ['*', 'GET'],
        path: '/{service}/{params?}',
        handler: function (request, reply) {
            var proxyInfo = registeredProxies.get(request.params.service);
            if (proxyInfo) {
                return reply.proxy(proxyInfo);
            } else {
                reply(404);
            }
        }
    });

    next();

    function isRegistered(prefix) {
        var key = prefix.split('/')[1];
        return registeredProxies.has(key);
    }

    function addNewProxy(payload) {
        var proxyInfo = {
            host: payload.host,
            port: payload.port,
            protocol: 'http'
        };
        registeredProxies.set(payload.prefix.split('/')[1], proxyInfo);
    }

    function registerPayloadIsValid(payload) {
        return payload.hasOwnProperty('host') &&
            payload.hasOwnProperty('port') &&
            payload.hasOwnProperty('prefix');
    }

    function unregisterPayloadIsValid(payload) {
        return payload.hasOwnProperty('prefix');
    }
};

exports.register.attributes = {
    name: 'registerNewService',
    version: '0.0.1'
};

