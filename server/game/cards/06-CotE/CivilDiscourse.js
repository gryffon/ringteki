const DrawCard = require('../../drawcard.js');
const { PlayTypes, DuelTypes, AbilityTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class CivilDiscourse extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.loser,
                    effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                        targetController: Players.Self,
                        effect: AbilityDsl.effects.increaseCost({
                            amount: 1,
                            playingType: PlayTypes.PlayFromHand
                        })
                    })
                })
            },
            effect: 'initiate a political duel between {1} and {2}',
            effectArgs: (context) => [context.targets.challenger, context.targets.duelTarget]
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} loses the duel and gains \'Increase the cost to play each card in your hand by 1.\'', loser);
            this.game.actions.cardLastingEffect({
                effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.increaseCost({
                        amount: 1,
                        playingType: PlayTypes.PlayFromHand
                    })
                })
            }).resolve(loser, context);
        } else {
            this.game.addMessage('{0} wins the duel, but there is no loser of the duel', winner);
        }
    }
}

CivilDiscourse.id = 'civil-discourse';

module.exports = CivilDiscourse;
