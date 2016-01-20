const StatusService = require('./statusService');

exports = module.exports = handler;

function handler(self) {

    StatusService.getChangeInformation(function (tentacle) {
        self.emit('status changed', JSON.stringify(tentacle));
    });

    return {
        emitAllStates: emitAllStates
    };

    function emitAllStates(){
        StatusService.getAllTentacles().forEach(tentacle => self.emit('status changed',JSON.stringify(tentacle) ))
    }

}
