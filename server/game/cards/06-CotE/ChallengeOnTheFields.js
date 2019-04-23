const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Durations, DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ChallengeOnTheFields extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                        duration: Durations.UntilEndOfDuel,
                        effect: AbilityDsl.effects.modifyBaseMilitarySkill(
                            context.player.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.challenger).length
                        )
                    }))
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: [
                        AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.duelTarget,
                            duration: Durations.UntilEndOfDuel,
                            effect: AbilityDsl.effects.modifyBaseMilitarySkill(
                                context.player.opponent.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.duelTarget).length
                            )
                        })),
                        AbilityDsl.actions.duel(context => ({
                            type: DuelTypes.Military,
                            challenger: context.targets.challenger,
                            gameAction: duel => AbilityDsl.actions.sendHome({ target: duel.loser })
                        }))
                    ]
                }
            },
            effect: 'initiate a military duel between {1} and {2}',
            effectArgs: (context) => [context.targets.challenger, context.targets.duelTarget]
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel, {1} loses the duel and is sent home', winner, loser);
            this.game.applyGameAction(context, { sendHome: loser });
        } else {
            this.game.addMessage('{0} wins the duel, but there is no loser of the duel', winner);
        }
    }
}

ChallengeOnTheFields.id = 'challenge-on-the-fields';

module.exports = ChallengeOnTheFields;
