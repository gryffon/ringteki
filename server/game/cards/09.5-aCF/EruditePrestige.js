const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class EruditePrestige extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier'
        });

        this.reaction({
            title: 'Give attached character +1 political',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player && context.source.parent.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyPoliticalSkill(1)
            })),
            effect: 'give +1{1} to {2}',
            effectArgs: context => ['political', context.source.parent]
        });
    }
}

EruditePrestige.id = 'erudite-prestige';

module.exports = EruditePrestige;
