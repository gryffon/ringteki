const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class GallantQuartermaster extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Gain two fate',
            when: {
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source
            },
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}

GallantQuartermaster.id = 'gallant-quartermaster';

module.exports = GallantQuartermaster;
