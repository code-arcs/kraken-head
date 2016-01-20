const Request = require('request-promise');

var exports = module.exports = statusService();

function statusService() {
    var registeredTentacles = [];
    var registeredServices = [];

    checkTentacleStatus();

    return {
        getAllTentacles: getAllTentacles,
        setNewTentacle: setNewTentacle,
        getChangeInformation: getChangeInformation
    };

    function getAllTentacles() {
        return registeredTentacles;
    }

    function setNewTentacle(tentacle) {
        registeredTentacles.push(tentacle);
        setTentacleStatus(tentacle, "Online");
    }

    function setTentacleStatus(tentacle, status) {
        tentacle.status = status;
        statusChanged(tentacle);
    }

    function getChangeInformation(cb) {
        registeredServices.push(cb);
    }

    function statusChanged(tentacle) {
        registeredServices.forEach(function (cb) {
            cb(tentacle);
        });
    }

    function checkTentacleStatus() {
        setInterval(function () {
            if (getAllTentacles().length > 0) {
                check(0);
            }

            function check(index) {
                var tentacle = getAllTentacles()[index];
                Request({
                    method: "GET",
                    uri: `http://${tentacle.host}:${tentacle.port}${tentacle.prefix}/status`,
                    json: true
                }).then(function () {
                    if (isStatusChanged(tentacle, "Online")) {
                        setTentacleStatus(tentacle, "Online");
                    }
                }).catch(function () {
                    if (isStatusChanged(tentacle, "Not available")) {
                        setTentacleStatus(tentacle, "Not available");
                    }
                }).finally(function () {
                    if (index < getAllTentacles().length - 1) {
                        check(index + 1);
                    }
                });
            }

        }, 5000);

        function isStatusChanged(tentacle, status) {
            return tentacle.status !== status;
        }
    }
}
