const DrawCard = require('../../drawcard.js');

class ReadyForBattle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) => event.card.controller === context.player && (event.context.source.type === 'ring' || 
                                                 context.player.opponent && event.context.source.controller === context.player.opponent) &&
                                                 event.card.allowGameAction('ready', context)
            },
            gameAction: ability.actions.ready().target(context => context.event.card)
        });
    }
}

ReadyForBattle.id = 'ready-for-battle';

module.exports = ReadyForBattle;
