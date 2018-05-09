const DrawCard = require('../../drawcard.js');

class Blackmail extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.getCost() < 3 && 
                                                  card.controller !== context.player && card.location === 'play area'
            },
            effect: 'take control of {0}',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.takeControl(context.player)
            })
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
