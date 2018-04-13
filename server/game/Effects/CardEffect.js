const _ = require('underscore');

const Effect = require('./Effect.js');

class CardEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect)
        this.targetController = properties.targetController || 'current';
        this.targetLocation = properties.targetLocation || 'play area';
    }

    isValidTarget(target) {
        return (
            this.targetLocation.includes(target.location) &&
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== 'current' || target.controller === this.source.controller) &&
            (this.targetController !== 'opponent' || target.controller !== this.source.controller)
        );
    }

    getTargets() {
        return this.game.getTargetsForEffect(this.match);
    }
    
}

module.exports = CardEffect;
