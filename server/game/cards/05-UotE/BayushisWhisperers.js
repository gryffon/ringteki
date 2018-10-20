const DrawCard = require('../../drawcard.js');

class BayushisWhisperers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at opponent\'s hand and name a card',
            condition: context => context.player.opponent && this.game.isDuringConflict(),
            effect: 'look at {1}\'s hand',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.lookAt(context => ({ target: context.player.opponent.hand.sortBy(card => card.name), chatMessage: true })),
            then: {
                handler: context => this.game.promptWithMenu(context.player, this, {
                    source: context.source,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                })
            }
        });
    }

    selectCardName(player, cardName, source) {
        this.game.addMessage('{0} names {1} - {2} cannot play copies of this card this phase', player, cardName, player.opponent);
        source.untilEndOfPhase(ability => ({
            targetController: 'opponent',
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'copiesOfX',
                source: source,
                params: cardName
            })
        }));
        return true;
    }
}

BayushisWhisperers.id = 'bayushi-s-whisperers';

module.exports = BayushisWhisperers;
