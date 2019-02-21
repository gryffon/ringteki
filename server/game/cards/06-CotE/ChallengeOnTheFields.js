const DrawCard = require('../../drawcard.js');
const { Durations, DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ChallengeOnTheFields extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} loses the duel and is sent home',
                messageArgs: context => context.game.currentDuel.loser,
                duringDuelAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.targets.challenger,
                        duration: Durations.UntilEndOfDuel,
                        effect: AbilityDsl.effects.modifyBaseMilitarySkill(
                            context.player.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.challenger).length
                        )
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.targets.duelTarget,
                        duration: Durations.UntilEndOfDuel,
                        effect: AbilityDsl.effects.modifyBaseMilitarySkill(
                            context.player.opponent.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.duelTarget).length
                        )
                    }))
                ]),
                gameAction: AbilityDsl.actions.sendHome(context => ({
                    target: context.game.currentDuel.loser
                }))
            }
        });
    }
}

ChallengeOnTheFields.id = 'challenge-on-the-fields';

module.exports = ChallengeOnTheFields;
