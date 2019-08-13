const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UjikTactics extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each non-unique character +1 military during this conflict',
            condition: _ => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => card.inConflict && !card.isUnique()),
                effect: AbilityDsl.effects.modifyMilitarySkill(1),
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all non-unique character they control +1 military skill'
        });
    }
}

UjikTactics.id = 'ujik-tactics';

module.exports = UjikTactics;
