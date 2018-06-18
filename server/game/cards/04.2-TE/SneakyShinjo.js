const DrawCard = require('../../drawcard.js');

class SneakyShinjo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Play this character',
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player
            },
            effect: 'play {0}',
            gameAction: ability.actions.playCard(context => ({
                target: context.source,
                location: 'province 1'
            }))
        });
    }
}

SneakyShinjo.id = 'sneaky-shinjo'; // This is a guess at what the id might be - please check it!!!

module.exports = SneakyShinjo;
