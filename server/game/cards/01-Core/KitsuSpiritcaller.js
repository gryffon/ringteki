const DrawCard = require('../../drawcard.js');

class KitsuSpiritcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.currentConflict,
            cost: ability.costs.bowSelf(),
            target: {
                activePrompt: 'Choose a character from a discard pile',
                cardType: 'character',
                gameAction: ability.actions.putIntoConflict(),
                cardCondition: card => (card.location === 'dynasty discard pile' || card.location === 'conflict discard pile') && card.controller === this.controller
            },
            effect: 'call {0} back from the dead until the end of the conflict',
            handler: context => {
                let event = GameActions.eventTo.putIntoConflict(context.target, context);
                event.addThenEvent(this.game.getEvent('unnamedEvent', {}, () => context.source.delayedEffect({
                    target: context.target,
                    when: {
                        onConflictFinished: () => context.target.allowGameAction('returnToDeck')
                    },
                    context: context,
                    handler: () => {
                        this.game.addMessage('{0} returns to the bottom of the deck due to {1}\'s effect', context.target, context.source);
                        this.game.openEventWindow(GameActions.eventTo.returnToDeck(context.target, context, true));
                    }
                })));
            }
        });
    }
}

KitsuSpiritcaller.id = 'kitsu-spiritcaller';

module.exports = KitsuSpiritcaller;
