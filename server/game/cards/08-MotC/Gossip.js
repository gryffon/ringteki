const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class Gossip extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Name a card that your opponent cannot play for the phase',
            handler: context => this.game.promptWithMenu(context.player, this, {
                context: context,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            })
        });
    }

    selectCardName(player, cardName, context) {
        this.game.addMessage('{0} names {1} - {2} cannot play copies of this card this phase', player, cardName, player.opponent);
        context.source.untilEndOfPhase(ability => ({
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'copiesOfX',
                source: context.source,
                params: cardName
            })
        }));
        return true;
    }
}

Gossip.id = 'gossip';
module.exports = Gossip;

