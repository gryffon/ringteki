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
            handler: context => {
                this.originalContext = context;
                this.game.promptWithMenu(context.player.opponent, this, {
                    source: context.source,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                });
            }
        });
    }

    selectCardName(player, cardName, source) {
        this.game.addMessage('{0} names {1} - {2} must choose if they want to reveal their hand', player, cardName, player.opponent);
        let opponent = player.opponent;
        this.game.promptWithHandlerMenu(source.controller, {
            choices: ['Yes', 'No'],
            handlers: [() => {
                let handCardNames = opponent.hand.map(card => card.name);
                this.game.addMessage('{0}\'s hand is: ' + handCardNames.join(', '), opponent);
                if(!handCardNames.includes(cardName)) {
                    this.game.applyGameAction(this.originalContext, {
                        sendHome: this.originalContext.target
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
