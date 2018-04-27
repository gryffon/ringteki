const AbilityGameActions = require('./AbilityGameActions');

class Connector {
    constructor(method) {
        for(const action in AbilityGameActions) {
            this[action] = (target, context, ...args) => {
                let gameAction = AbilityGameActions[action](...args);
                gameAction.context = context;
                gameAction.cards = target;
                return gameAction[method](target);
            };
        }
    }
}

const GameActions = {
    eventTo: new Connector('getEvent'),
    canBeAffectedBy: new Connector('canAffect'),
    eventArrayTo: new Connector('getEventArray')
};

module.exports = GameActions;
