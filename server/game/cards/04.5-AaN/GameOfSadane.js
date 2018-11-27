const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class GameOfSadane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel(context => ({
                        type: 'political',
                        challenger: context.targets.challenger,
                        resolutionHandler: (winner, loser) => this.duelOutcome(context, winner, loser)
                    }))
                }
            }
        });
    }

    duelOutcome(context, winner, loser) {
        if(winner && loser) {
            this.game.addMessage('{0} wins the duel and is honored - {1} loses and is dishonored', winner, loser);
            this.game.applyGameAction(context, { honor: winner, dishonor: loser });
        } else {
            this.game.addMessage('{0} wins the duel and is honored', winner);
            this.game.applyGameAction(context, { honor: winner });
        }
    }
}

GameOfSadane.id = 'game-of-sadane';

module.exports = GameOfSadane;
