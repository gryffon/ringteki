const DrawCard = require('../../drawcard.js');

class HirumaAmbusher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Disable a character',
            when: {
                'onCharacterEntersPlay': (event, context) => event.card === context.source && context.source.isDefending()
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            effect: 'prevent {0} from using any abilities',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.cardCannot('triggerAbilities')
            })
        });
    }
}

HirumaAmbusher.id = 'hiruma-ambusher';

module.exports = HirumaAmbusher;
