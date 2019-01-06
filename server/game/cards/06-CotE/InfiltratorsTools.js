const DrawCard = require('../../drawcard.js');

class InfiltratorsTools extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('shinobi')) {
            return super.canAttach(card, context);
        }
        return false;
    }
}

InfiltratorsTools.id = 'infiltrator-s-tools';

module.exports = InfiltratorsTools;
