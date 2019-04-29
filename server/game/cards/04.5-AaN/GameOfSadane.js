const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

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
                        type: DuelTypes.Political,
                        challenger: context.targets.challenger,
                        gameAction: duel => ability.actions.multiple([
                            ability.actions.honor({ target: duel.winner }),
                            ability.actions.dishonor({ target: duel.loser })
                        ])
                    }))
                }
            }
        });
    }
}

GameOfSadane.id = 'game-of-sadane';

module.exports = GameOfSadane;
