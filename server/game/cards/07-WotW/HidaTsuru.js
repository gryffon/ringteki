const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HidaTsuru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Give this character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });

        this.reaction({
            title: 'Give this character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.card.isParticipating() && context.source.isParticipating()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}

HidaTsuru.id = 'hida-tsuru';

module.exports = HidaTsuru;
