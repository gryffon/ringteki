const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CourtOfJustice extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at 3 random cards of the opponent\'s hand',
            when: {
                afterConflict: (event, context) => 
                    event.conflict.winner === context.player && 
                    event.conflict.conflictType === 'political' &&
                    context.player.opponent
            },
            gameAction: AbilityDsl.actions.lookAt(context => ({
                target: context.player.opponent.hand.shuffle().slice(0, 3),
                message: "reveals {0} from {1}\'s hand.",
                messageArgs: cards => [cards, context.player.opponent]
            })),
            effect: 'look at 3 random cards from {1}\'s hand.',
            effectArgs: context => context.player.opponent
        });
    }
}

CourtOfJustice.id = 'court-of-justice';

module.exports = CourtOfJustice;
