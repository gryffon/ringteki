const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AsakoTakahiro extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants(card => card.isDishonored && card !== context.source))),
                AbilityDsl.effects.modifyPoliticalSkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants(card => card.isHonored && card !== context.source)))
            ]
        });
    }
}

AsakoTakahiro.id = 'asako-takahiro';

module.exports = AsakoTakahiro;
