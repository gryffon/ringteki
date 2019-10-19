const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class AdoptedKin extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1
        });

        this.persistentEffect({
            condition: context => !!context.source.parent,
            match: (card, context) => card !== context.source && card.getType() === CardTypes.Attachment && context.source.parent === card.parent,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}

AdoptedKin.id = 'adopted-kin';

module.exports = AdoptedKin;
