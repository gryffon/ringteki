const BaseAbility = require('./baseability.js');
const EffectSource = require('./EffectSource.js');

class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source || new EffectSource(this.game);
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = properties.costs || {};
        this.targets = properties.targets || {};
        this.rings = properties.rings || {};
        this.selects = properties.selects || {};
        this.stage = properties.stage || 'effect';
    }

    copy(newProps) {
        return new AbilityContext(Object.assign({}, {
            game: this.game,
            source: this.source,
            player: this.player,
            ability: this.ability,
            costs: this.costs,
            targets: this.targets,
            rings: this.rings,
            selects: this.selects,
            state: this.stage
        }, newProps));
    }
}

module.exports = AbilityContext;
