const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, EffectNames } = require('../../Constants');

class BayushiGensato extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow({ target: duel.loser }),
                    AbilityDsl.actions.dishonor({ target: duel.winner })
                ]),
                statistic: (card) => card.getMilitarySkillExcludingModifiers([EffectNames.AttachmentMilitarySkillModifier, EffectNames.AttachmentPoliticalSkillModifier])
            }
        });
    }
}

BayushiGensato.id = 'bayushi-gensato';

module.exports = BayushiGensato;
