const DrawCard = require('../../drawcard.js');

class InfiltratorsTools extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'shinobi'
        });

        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
}

InfiltratorsTools.id = 'infiltrator-s-tools';

module.exports = InfiltratorsTools;
