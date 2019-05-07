const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/GameActions');
const { Players, CardTypes, AbilityTypes, DuelTypes } = require('../../Constants');

class DuelistTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility(AbilityTypes.Action, {
                title: 'Initiate a duel to bow',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel(context => ({
                        type: DuelTypes.Military,
                        challenger: context.source,
                        gameAction: duel => ability.actions.bow({ target: duel.loser }),
                        costHandler: (context, prompt) => this.costHandler(context, prompt)
                    }))
                }
            })
        });
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
                () => GameActions.chosenDiscard({ amount: difference }).resolve(lowBidder, context)
            ]
        });
    }
}

DuelistTraining.id = 'duelist-training';

module.exports = DuelistTraining;
