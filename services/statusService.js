const Request = require('request-promise');


var exports = module.exports = statusService();

function statusService() {
    var registeredTentacles = [];

    checkTentacleStatus();

    return {
        getAllTentacles: getAllTentacles,
        setNewTentacle: setNewTentacle
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
    }


    function checkTentacleStatus() {
        setInterval(function () {
            if (getAllTentacles().length > 0)
                check(0);

            function check(index) {
                var tentacle = getAllTentacles()[index];
                Request({
                    method: "GET",
                    uri: 'http://' + tentacle.host + ':' + tentacle.port + '/status',
                    json: true
                }).then(function () {
                    setTentacleStatus(tentacle, "Online");
                }).catch(function () {
                    setTentacleStatus(tentacle, "Not available");
                }).finally(function () {
                    if (index < getAllTentacles().length - 1) {
                        check(index + 1);
                    }
                });
            }

        }, 5000);
    }

}