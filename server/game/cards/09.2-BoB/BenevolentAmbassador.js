const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BenevolentAmbassador extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'give both players honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player
            },
            gameAction: AbilityDsl.actions.multiple([AbilityDsl.actions.gainHonor(), AbilityDsl.actions.opponentGainHonor()])
        });
    }
}

BenevolentAmbassador.id = 'benevolent-ambassador';

module.exports = BenevolentAmbassador;
