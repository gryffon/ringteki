const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class FallenInBattle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   event.conflict.skillDifference >= 5
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            max: ability.limit.perConflict(1)
        });
    }
}

FallenInBattle.id = 'fallen-in-battle';

module.exports = FallenInBattle;
