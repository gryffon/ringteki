const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, PersonalHonorStatus } = require('../../Constants');

class ShamelessGossip extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a status token',
            condition: context => context.source.isParticipating(),
            targets: {
                first: {
                    activePromptTitle: 'Choose a Character to move a status token from',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: card => card.personalHonorStatus !== PersonalHonorStatus.Ordinary
                },
                second: {
                    activePromptTitle: 'Choose a Character to move the status token to',
                    dependsOn: 'first',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card !== context.targets.first &&
                        card.personalHonorStatus !== context.targets.first.personalHonorStatus,
                    gameAction: AbilityDsl.actions.moveStatusToken(context => ({
                        target: context.targets.first.personalHonor,
                        recipient: context.targets.second
                    }))
                }
            },
            effect: 'move {1}\'s {2} to {3}',
            effectArgs: context => [context.targets.first, context.targets.first.personalHonor, context.targets.second]
        });
    }
}

ShamelessGossip.id = 'shameless-gossip';

module.exports = ShamelessGossip;

