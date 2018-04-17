const _ = require('underscore');

const Effect = require('./Effect.js');

class ConflictEffect extends Effect {
    constructor(game, source, properties, effect) {
        super(game, source, properties, effect);
        // Overide any erroneous match passed through properties
        this.match = () => true;
        this.effect.key = 'conflict';
    }

    getTargets() {
        return this.game.currentConflict ? [this.game.currentConflict] : [];
    }
}

module.exports = ConflictEffect;
