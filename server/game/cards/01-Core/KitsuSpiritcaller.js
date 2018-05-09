const DrawCard = require('../../drawcard.js');

class KitsuSpiritcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bowSelf(),
            target: {
                activePrompt: 'Choose a character from a discard pile',
                cardCondition: (card, context) => card.location.includes('discard pile') && card.controller === context.player,
                gameAction: ability.actions.putIntoConflict()
            },
            effect: 'call {} back from the dead until the end of the conflict',
            then: context => ({
                delayedEffect: {
                    target: context.target,
                    when: {
                        onConflictFinished: () => true
                    },
                    message: '{1} returns to the bottom of the deck due to {0}\'s effect',
                    gameAction: ability.actions.returnToDeck(true)
                }
            })
        });
    }
}

KitsuSpiritcaller.id = 'kitsu-spiritcaller';

module.exports = KitsuSpiritcaller;
