const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class AspirantChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.action({
            title: 'Initiate a Military duel',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
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
        this.game.addMessage('{0} wins the duel and is honored', winner);
        this.game.applyGameAction(context, { honor: winner });
    }
}

AspirantChallenger.id = 'aspirant-challenger';

module.exports = AspirantChallenger;
