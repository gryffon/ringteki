const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UjikTactics extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each non-unique character +1 military during this conflict',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => !card.isUnique()),
                effect: AbilityDsl.effects.modifyMilitarySkill(1),
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all non-unique character they control +1{1}',
            effectArgs: ['military']
        });
    }
}

UjikTactics.id = 'ujik-tactics';

module.exports = UjikTactics;
