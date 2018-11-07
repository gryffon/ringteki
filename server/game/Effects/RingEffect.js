const _ = require('underscore');

const Effect = require('./Effect.js');

class RingEffect extends Effect {
    getTargets() {
        return _.filter(this.game.rings, ring => this.match(ring, this.context));
    }
}

module.exports = RingEffect;
