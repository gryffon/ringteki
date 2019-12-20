const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Desolation extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Blank opponent\'s provinces',
            cost: AbilityDsl.costs.payHonor(2),
            condition: context => context.player.opponent,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.game.provinceCards.filter(a => a.controller === context.player.opponent),
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            })),
            effect: 'blank {1}\'s provinces until the end of the phase',
            effectArgs: context => context.player.opponent.name
        });
    }
}

Desolation.id = 'desolation';

module.exports = Desolation;
