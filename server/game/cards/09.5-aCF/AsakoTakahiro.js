const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AsakoTakahiro extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.modifyPoliticalSkill((card, context) => {
                let controllerHonorCharNum = context.player
                    .filterCardsInPlay((card) => card.isParticipating() && card.isHonored).length;
                let opponentHonoredCharNum = context.player.opponent
                    .filterCardsInPlay((card) => card.isParticipating() && card.isHonored).length;
                return (controllerHonorCharNum + opponentHonoredCharNum) * 2;
            })
        });

        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.modifyMilitarySkill((card, context) => {
                let controllerDishonorCharNum = context.player
                    .filterCardsInPlay((card) => card.isParticipating() && card.isDishonored).length;
                let opponentDishonoredCharNum = context.player.opponent
                    .filterCardsInPlay((card) => card.isParticipating() && card.isDishonored).length;
                return (controllerDishonorCharNum + opponentDishonoredCharNum) * 2;
            })
        });
    }
}

AsakoTakahiro.id = 'asako-takahiro';

module.exports = AsakoTakahiro;
