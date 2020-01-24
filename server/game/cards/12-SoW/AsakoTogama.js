const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AsakoTogama extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a claimed ring with an unclaimed one',
            effect: 'switch a claimed ring with an unclaimed one',
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: ring => ring.claimedBy === context.player.name,
                    message: '{0} returns the {1}',
                    messageArgs: ring => [context.player, ring],
                    gameAction: AbilityDsl.actions.returnRing()
                })),
                AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: ring => ring.isUnclaimed(),
                    message: '{0} takes the {1}',
                    messageArgs: ring => [context.player, ring],
                    gameAction: AbilityDsl.actions.takeRing({ takeFate: true })
                }))
            ])
        });
    }
}

AsakoTogama.id = 'asako-togama';

module.exports = AsakoTogama;
