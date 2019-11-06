const EffectSource = require('./EffectSource');
const AbilityDsl = require('./abilitydsl');

class StatusToken extends EffectSource {
    constructor(game, card, isHonored) {
        super(game, isHonored ? 'Honored Token' : 'Dishonored Token');
        this.honored = !!isHonored;
        this.dishonored = !isHonored;
        this.card = card;
        this.printedType = 'token';
        this.persistentEffects = [];

        this.applyHonorEffects();
    }

    applyHonorEffects() {
        if(!this.card) {
            return;
        }
        let amount = this.honored ? card => card.getGlory() : card => 0 - card.getGlory();
        let effect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills(amount)
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    removeHonorEffects() {
        this.persistentEffects.forEach(effect => {
            this.removeEffectFromEngine(effect.ref);
            effect.ref = [];
        });
        this.persistentEffects = [];
    }

    setCard(card) {
        this.removeHonorEffects();
        this.card = card;
        this.applyHonorEffects();
    }
}

module.exports = StatusToken;
