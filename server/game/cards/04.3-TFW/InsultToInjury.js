const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class InsultToInjury extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor the loser of a duel',
            when: {
                afterDuel: (event, context) => {
                    if(!event.winner) {
                        return false;
                    }
                    if(Array.isArray(event.winner)) {
                        return event.winner.some(card => card.hasTrait('duelist') && card.controller === context.player);
                    }
                    return event.winner.hasTrait('duelist') && event.winner.controller === context.player;
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.dishonor(context => ({ target: !Array.isArray(context.event.loser) ? context.event.loser : null })),
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a character to dishonor',
                    cards: Array.isArray(context.event.loser) ? context.event.loser : [],
                    gameAction: AbilityDsl.actions.dishonor(),
                    message: '{0} chooses to dishonor {1}',
                    messageArgs: (card, player) => [player, card]
                }))
            ]),
            effect: '{1}',
            effectArgs: context => [Array.isArray(context.event.loser) ? 'choose to dishonor a loser of the duel' : ['dishonor {0}', context.event.loser]]
        });
    }
}

InsultToInjury.id = 'insult-to-injury';

module.exports = InsultToInjury;
