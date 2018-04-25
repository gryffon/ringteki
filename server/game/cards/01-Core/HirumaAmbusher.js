const DrawCard = require('../../drawcard.js');

class HirumaAmbusher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Disable a character',
            when: {
                'onCardEntersPlay': (event, context) => event.card === context.source && context.source.isDefending()
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            message: '{0} uses {1}\'s ability to prevent {2} from using any abilities',
            untilEndOfConflict: {
                effect: ability.effects.cardCannot('triggerAbilities')
            }
        });
    }
}

HirumaAmbusher.id = 'hiruma-ambusher';

module.exports = HirumaAmbusher;
