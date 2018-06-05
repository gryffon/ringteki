const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/GameActions');

class DuelistTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.grantedAbilityLimits = {};
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                title: 'Initiate a duel to bow',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: 'character',
                    cardCondition: (card, context) => card.isParticipating() && card.controller !== context.player,
                    gameAction: ability.actions.duel(
                        'military', 
                        (context, winner, loser) => this.resolutionHandler(context, winner, loser), 
                        (context, prompt) => this.costHandler(context, prompt)
                    ).options(context => ({ challenger: context.source }))
                }
            })
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel, and bows {1}', winner, loser);
            this.game.applyGameAction(context, { bow: loser });
        }
    }

    costHandler(context, prompt) {
        let lowBidder = this.game.getFirstPlayer();
        let difference = lowBidder.honorBid - lowBidder.opponent.honorBid;
        if(difference < 0) {
            lowBidder = lowBidder.opponent;
            difference = -difference;
        } else if(difference === 0) {
            return;
        }
        if(lowBidder.hand.size() < difference) {
            prompt.transferHonorAfterBid(context);
            return;
        }
        this.game.promptWithHandlerMenu(lowBidder, {
            activePromptTite: 'Difference in bids: ' + difference.toString(),
            source: this,
            choices: ['Pay with honor', 'Pay with cards'],
            handlers: [
                () => prompt.transferHonorAfterBid(context), 
                () => GameActions.chosenDiscard(difference).resolve(lowBidder, context)
            ]
        });
    }
    
    leavesPlay() {
        this.grantedAbilityLimits = {};
        super.leavesPlay();
    }
}

DuelistTraining.id = 'duelist-training';

module.exports = DuelistTraining;
