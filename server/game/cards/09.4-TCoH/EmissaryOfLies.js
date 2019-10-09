const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class EmissaryOfLies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            condition: context => context.source.isParticipating(),
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
                this.game.actions.lookAt().resolve(opponent.hand.sortBy(card => card.name), this.originalContext);
                if(!handCardNames.includes(cardName)) {
                    this.game.actions.sendHome().resolve(this.originalContext.target, this.originalContext);
                    return true;
                }
                return true;
            }, () => true],
            activePromptTitle: 'Do you want to reveal your hand?',
            waitingPromptTitle: 'Waiting for opponent to choose to reveal their hand or not'
        });
        return true;
    }
}

EmissaryOfLies.id = 'emissary-of-lies';
module.exports = EmissaryOfLies;
