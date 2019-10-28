const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TwoHeavensTechnique extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.attachments.filter(card => card.hasTrait('weapon')).length === 2,
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}

TwoHeavensTechnique.id = 'two-heavens-technique';

module.exports = TwoHeavensTechnique;
