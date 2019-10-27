const DrawCard = require('../../drawcard.js');
const { PlayTypes } = require('../../Constants');

class Infiltrator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at the top card of an opponent\'s deck and play or discard it',
            condition: () => this.game.isDuringConflict(),
            effect: 'look at the top card of an opponent\'s deck and play or discard it',
            gameAction: ability.actions.chooseAction(context => {
                let topCard = context.controlsTarget = context.player.opponent && context.player.opponent.conflictDeck.first();
                return {
                    activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                    choices: {
                        'Play this card': ability.actions.playCard({ target: topCard, playType: PlayTypes.PlayFromHand }),
                        'Discard this card': ability.actions.discardCard({ target: topCard })
                    },
                    messages: { 'Discard this card': '{0} chooses to discard {1}' }
                };
            })
        });
    }

    canPlay(context, playType) {
        if(!context.player.opponent || context.player.showBid <= context.player.opponent.showBid) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}

Infiltrator.id = 'infiltrator';

module.exports = Infiltrator;
