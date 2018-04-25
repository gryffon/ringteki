const DrawCard = require('../../drawcard.js');

class Blackmail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller !== context.player && card.getCost() < 3 && 
                                                  card.location === 'play area' && card.allowGameAction('takeControl', context)
            },
            effect: 'take control of {0}',
            handler: context => context.source.untilEndOfConflict(ability => ({
                match: context.target,
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }

    canPlay(context) {
        if(this.controller.opponent && this.controller.honor < this.controller.opponent.honor) {
            return super.canPlay(context);
        }
        return false;
    }
}

Blackmail.id = 'blackmail';

module.exports = Blackmail;
