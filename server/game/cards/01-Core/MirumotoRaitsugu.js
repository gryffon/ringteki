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
                    gameAction: duel => ability.actions.conditional({
                        target: duel.loser,
                        condition: duel.loser && duel.loser.fate > 0,
                        trueGameAction: ability.actions.removeFate(),
                        falseGameAction: ability.actions.discardFromPlay()
                    })
                }))
            }
        });
    }
}

MirumotoRaitsugu.id = 'mirumoto-raitsugu';

module.exports = MirumotoRaitsugu;
