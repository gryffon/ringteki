const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class HonestChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.action({
            title: 'Initiate a military duel',
            condition: () => this.isParticipating(),
            target: {
                cardtype: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: 'military',
                    challenger: context.source,
                    resolutionHandler: (winner) => this.resolutionHandler(context, winner)
                }))
            }
        });
    }
    resolutionHandler(context, winner) {
        if(winner.controller.cardsInPlay.any(card => card.allowGameAction('moveToConflict', context))) {
            this.game.addMessage('{0} wins the duel', winner);
            this.game.promptForSelect(winner.controller, {
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardTypes.Character,
                cardCondition: card => card.allowGameAction('moveToConflict', context),
                controller: Players.Self,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves {1} to the conflict', player, card);
                    this.game.applyGameAction(context, { moveToConflict: card });
                    return true;
                }
            });
        } else {
            this.game.addMessage('{0} wins the duel, but there are no valid targets for the duel effect', winner);
        }
    }
}

HonestChallenger.id = 'honest-challenger';

module.exports = HonestChallenger;
