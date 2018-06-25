const ProvinceCard = require('../../provincecard.js');

class SacredSanctuary extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Choose a monk character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            target: {
                controller: 'self',
                cardCondition: card => card.hasTrait('monk') && card.bowed,
                gameAction: [
                    ability.actions.ready(),
                    ability.actions.cardLastingEffect({
                        condition: () => this.game.isDuringConflict,
                        effect: ability.effects.doesNotBow()
                    }),
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.cardCannot('bow', context => (
                                context.source.type !== 'ring' && context.player && context.player.opponent &&
                                context.source.controller === context.player.opponent
                        ))
                    })
                ]           
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of a political conflict'
        });
    }
}

SacredSanctuary.id = 'sacred-sanctuary';

module.exports = SacredSanctuary;
