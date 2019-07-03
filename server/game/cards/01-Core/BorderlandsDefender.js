const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BorderlandsDefender extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}

BorderlandsDefender.id = 'borderlands-defender';

module.exports = BorderlandsDefender;
