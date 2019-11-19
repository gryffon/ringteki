const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class GraspOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action({
            title: 'Opponent\'s cards cannot join this conflict',
            condition: context => this.game.isDuringConflict() && context.player.opponent,
            cost: ability.costs.bowSelf(),
            effect: 'prevent the opponent from bringing characters to the conflict',
            gameAction: [
                ability.actions.cardLastingEffect(context => ({
                    target: context.player.opponent.cardsInPlay.toArray(),
                    effect: ability.effects.cardCannot('moveToConflict')
                })),
                ability.actions.playerLastingEffect({
                    targetController: Players.Opponent,
                    effect: ability.effects.playerCannot({
                        cannot: PlayTypes.PlayFromHand,
                        restricts: 'characters'
                    })
                })
            ]
        });
    }
}

GraspOfEarth.id = 'grasp-of-earth';

module.exports = GraspOfEarth;
