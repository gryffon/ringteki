const Effect = require('./Effect.js');
const { Players } = require('../Constants');

class PlayerEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        if(typeof this.match !== 'function') {
            this.match = player => true; // eslint-disable-line no-unused-vars
        }

    }

    isValidTarget(target) {
        if(this.targetController === Players.Self && target === this.source.controller.opponent) {
            return false;
        } else if(this.targetController === Players.Opponent && target === this.source.controller) {
            return false;
        }
        return true;
    }

    getTargets() {
        return this.game.getPlayers().filter(player => this.match(player));
    }
}

module.exports = PlayerEffect;
