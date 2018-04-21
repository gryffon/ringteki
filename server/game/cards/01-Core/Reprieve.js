const DrawCard = require('../../drawcard.js');

class Reprieve extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: event => event.card === this.parent
            },
            canCancel: true,
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to save {2}', context.player, context.source, context.source.parent);
                let window = context.event.window;
                context.cancel();
                window.addEvent(this.game.getEventsForGameAction('discardFromPlay', context.source, context)[0]);
            }
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
