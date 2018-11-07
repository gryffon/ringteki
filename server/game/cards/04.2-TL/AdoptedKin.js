const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class AdoptedKin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => !!context.source.parent,
            match: (card, context) => card !== context.source && card.getType() === 'attachment' && context.source.parent === card.parent,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }

    canAttach(card, context) {
        if(card.attachments && card.attachments.any(card => card.id === 'adopted-kin' && card !== this)) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

AdoptedKin.id = 'adopted-kin';

module.exports = AdoptedKin;
