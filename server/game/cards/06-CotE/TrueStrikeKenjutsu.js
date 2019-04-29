const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class TrueStrikeKenjutsu extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility('action', {
                title: 'Initiate a military duel',
                initiateDuel: {
                    type: DuelTypes.Military,
                    gameAction: duel => AbilityDsl.actions.bow({ target: duel.loser }),
                    statistic: (card) => card.getBaseMilitarySkill()
                },
                printedAbility: false
            })
        });
    }
}

TrueStrikeKenjutsu.id = 'true-strike-kenjutsu';

module.exports = TrueStrikeKenjutsu;
