const DrawCard = require('../../drawcard.js');

class PolicyDebate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: 'character',
                    cardCondition: (card, context) => card.isParticipating() && card.controller === context.player && !card.hasDash('political')
                },
                duelTarget: {
                    cardType: 'character',
                    cardCondition: (card, context) => card.isParticipating() && card.controller === context.player.opponent,
                    gameAction: ability.actions.duel().options(context => ({
                        type: 'political',
                        challenger: context.targets.challenger,
                        resolutionHandler: this.duelOutcome 
                    }))
                }
            }
        });
    }

    duelOutcome(winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel - {1} reveals their hand: {2}', winner, loser.controller, loser.controller.hand.sortBy(card => card.name));
            if(loser.controller.hand.size() === 0) {
                return;
            }
            this.game.promptWithHandlerMenu(winner.controller, {
                activePromptTitle: 'Choose card to discard',
                cards: loser.controller.hand.sortBy(card => card.name),
                cardHandler: card => loser.controller.discardCardFromHand(card),
                source: this
            });
        }
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
