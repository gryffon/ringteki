const DrawCard = require('../../drawcard.js');

class Spyglass extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.draw(),
            limit: ability.limit.perRound(2)
        });
    }
}

Spyglass.id = 'spyglass';

module.exports = Spyglass;
