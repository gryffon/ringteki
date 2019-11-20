const EffectValue = require('./EffectValue');

class SuppressEffect extends EffectValue {
    constructor(predicate) {
        super([]);
        this.predicate = predicate;
    }

    recalculate() {
        if(typeof this.predicate !== 'function') {
            return false;
        }
        const oldValue = this.value;
        const suppressedEffects = this.context.game.effectEngine.effects.filter(effect => this.predicate(effect.effect));
        const newValue = suppressedEffects.map(effect => effect.effect);
        this.setValue(newValue);
        return oldValue.length !== newValue.length || oldValue.some(element => !newValue.includes(element));
    }
}

module.exports = SuppressEffect;
