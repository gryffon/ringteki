const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TwoHeavensTechnique extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.attachments.filter(card => card.hasTrait('weapon')).length === 2,
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('bushi')) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

TwoHeavensTechnique.id = 'two-heavens-technique';

module.exports = TwoHeavensTechnique;
