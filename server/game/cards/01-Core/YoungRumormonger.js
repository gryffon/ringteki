const DrawCard = require('../../drawcard.js');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: event => event.card.allowGameAction('honor'),
                onCardDishonored: event => event.card.allowGameAction('dishonor')
            },
            canCancel: true,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => {
                    if(context.event.name === 'onCardHonored') {
                        return (card !== context.event.card && 
                                card.location === 'play area' && 
                                card.controller === context.event.card.controller &&
                                card.allowGameAction('honor', context));
                    }
                    return (card !== context.event.card && 
                            card.location === 'play area' && 
                            card.controller === context.event.card.controller &&
                            card.allowGameAction('dishonor', context));
                }
            },
            handler: context => {
                let window = context.event.window;
                context.cancel();
                if(context.event.name === 'onCardHonored') {
                    this.game.addMessage('{0} uses {1} to honor {2} instead of {3}', this.controller, this, context.target, context.event.card);
                    let event = context.game.addEventToWindow(window, 'onCardHonored', { player: this.controller, card: context.target, source: this }, () => context.target.honor());
                    context.event.result = event.result;
                } else {
                    this.game.addMessage('{0} uses {1} to dishonor {2} instead of {3}', this.controller, this, context.target, context.event.card);
                    let event = context.game.addEventToWindow(window, 'onCardDishonored', { player: this.controller, card: context.target, source: this }, () => context.target.dishonor());
                    context.event.result = event.result;
                }
            } 
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
