const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class EmissaryOfLies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'try to name a card in your opponents hand',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player.opponent
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
        this.game.promptWithHandlerMenu(source.controller, {
            choices: ['Yes', 'No'],
            handlers: [(context) => {
                let handCardNames = source.controller.hand.map(card => card.name);
                this.game.addMessage(handCardNames.join(', '));
                if(handCardNames.includes(cardName)) {
                    this.game.applyGameAction(context, {
                        sendHome: context.target
                    });
                    return true;
                }
                return true;
            }, () => true],
            activePromptTitle: 'Do you want to reveal your hand',
            waitingPromptTitle: 'Waiting for opponent to choose to reveal their hand or not'
        });
        return true;
    }
}

EmissaryOfLies.id = 'emissary-of-lies';
module.exports = EmissaryOfLies;
