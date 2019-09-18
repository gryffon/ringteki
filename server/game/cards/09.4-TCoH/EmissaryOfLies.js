const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes, CardTypes } = require('../../Constants');

class EmissaryOfLies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'try to name a card in your opponents hand',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controler === context.player.opponent,
            },
            handler: context => this.game.promptWithMenu(context.player.opponent, this, {
                source: context.source,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            })
        });
    }

    selectCardName(player, cardName, source) {
        this.game.addMessage('{0} names {1} - {2} must choose to reveal their hand', player, cardName, player.opponent);
        source.untilEndOfPhase(ability => ({
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'copiesOfX',
                source: source,
                params: cardName
            })
        }));
        return true;
    }
}

EmissaryOfLies.id = 'emissary-of-lies';
module.exports = EmissaryOfLies;
