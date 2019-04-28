const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ChallengeOnTheFields extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                challengerEffect: AbilityDsl.effects.modifyBaseMilitarySkill(
                    context.player.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.challenger).length
                ),
                targetEffect: AbilityDsl.effects.modifyBaseMilitarySkill(
                    context.player.opponent.filterCardsInPlay(card => card.isParticipating() && card !== context.targets.duelTarget).length
                ),
                gameAction: duel => AbilityDsl.actions.sendHome({ target: duel.loser })
            })
        });
    }
}

ChallengeOnTheFields.id = 'challenge-on-the-fields';

module.exports = ChallengeOnTheFields;
