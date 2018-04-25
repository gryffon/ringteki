const AbilityGameActions = require('./AbilityGameActions');

class EventBuilder {
    constructor() {
        for(const action in AbilityGameActions) {
            this[action] = (target, context, ...args) => {
                let gameAction = AbilityGameActions[action];
                gameAction.
        }

    }

}

const XYZ = {
    eventTo: new EventBuilder()
}

class GameActions {
    static eventTo(properties) {
        properties = CardSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if(!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        if(properties.mode) {
            return properties;
        }

        if(properties.maxStat) {
            properties.mode = 'maxStat';
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = 'single';
        } else if(properties.numCards === 0) {
            properties.mode = 'unlimited';
        } else {
            properties.mode = 'upTo';
        }

        return properties;
    }
}

module.exports = CardSelector;