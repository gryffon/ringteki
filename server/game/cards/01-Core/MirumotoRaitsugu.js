const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

class MirumotoRaitsugu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Duel an opposing character',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    gameAction: duel => ability.actions.otherwise({
                        target: duel.loser,
                        gameAction: ability.actions.removeFate(),
                        otherwiseAction: ability.actions.discardFromPlay()
                    })
                }))
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser && loser.fate > 0) {
            this.game.addMessage('{0} wins the duel, and {1} loses a fate', winner, loser);
            this.game.applyGameAction(context, { removeFate: loser });
        } else if(loser) {
            this.game.addMessage('{0} wins the duel, and {1} is discarded', winner, loser);
            this.game.applyGameAction(context, { discardFromPlay: loser });
        }
    }
}

MirumotoRaitsugu.id = 'mirumoto-raitsugu';

module.exports = MirumotoRaitsugu;
