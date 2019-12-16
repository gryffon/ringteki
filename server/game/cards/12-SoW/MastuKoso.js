import { Durations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class MatsuKoso extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lower military skill',
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getParticipants(),
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.modifyMilitarySkill(card => isNaN(card.printedPoliticalSkill) ? 0 : -card.printedPoliticalSkill)
            })),
            effect: 'lower the military skill of {1} by their respective pirnted political skill',
            effectArgs: context => [context.game.currentConflict.getParticipants()]
        });
    }
}

MatsuKoso.id = 'matsu-koso';

module.exports = MatsuKoso;
