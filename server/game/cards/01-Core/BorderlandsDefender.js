const DrawCard = require('../../drawcard.js');

class BorderlandsDefender extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: [
                ability.effects.cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                ability.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}

BorderlandsDefender.id = 'borderlands-defender';

module.exports = BorderlandsDefender;
