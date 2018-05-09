const DrawCard = require('../../drawcard.js');

class GoblinSneak extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Steal a fate',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'take a fate from {1} and place it on {0}',
            effectArgs: context => context.player.opponent,
            gameAction: context => ability.actions.placeFate(1, context.player.opponent)
        });
    }
}

GoblinSneak.id = 'goblin-sneak';

module.exports = GoblinSneak;
