const DrawCard = require('../../drawcard.js');

class SteadfastWitchHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready character',
            cost: ability.costs.sacrifice(card => card.getType() === 'character'),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardCondition: card =>
                    card.location === 'play area'
                    && card.bowed
                    && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} and sacrifices {2} to ready {3}', context.player, this, context.costs.sacrifice, context.target);
                context.target.controller.readyCard(context.target);
            }
        });
    }
}

SteadfastWitchHunter.id = 'steadfast-witch-hunter';

module.exports = SteadfastWitchHunter;
