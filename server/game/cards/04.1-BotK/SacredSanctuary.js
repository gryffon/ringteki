const ProvinceCard = require('../../provincecard.js');

class SacredSanctuary extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Choose a monk character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.hasTrait('monk'),
                gameAction: [
                    ability.actions.ready(),
                    ability.actions.cardLastingEffect({
                        condition: () => this.game.isDuringConflict(),
                        effect: ability.effects.doesNotBow()
                    }),
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    })
                ]
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict'
        });
    }
}

SacredSanctuary.id = 'sacred-sanctuary';

module.exports = SacredSanctuary;
