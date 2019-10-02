const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MatsuGohei extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking() &&
                            context.player.cardsInPlay
                                .filter(card => card.hasTrait('bushi') &&
                                    card !== context.source &&
                                    card.isAttacking()).length >= 2,

            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}

MatsuGohei.id = 'matsu-gohei';

module.exports = MatsuGohei;
