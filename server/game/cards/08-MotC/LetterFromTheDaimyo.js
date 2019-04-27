const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class LetterFromTheDaimyo extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent discard 2 cards',
            cost: AbilityDsl.costs.sacrificeSelf(),
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.chosenDiscard({ amount: 2 })
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

LetterFromTheDaimyo.id = 'letter-from-the-daimyo';

module.exports = LetterFromTheDaimyo;
