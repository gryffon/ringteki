const DrawCard = require('../../drawcard.js');

class WindsweptYurt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 2 fate or 2 honor',
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Each player gains 2 fate': () => true,
                    'Each player gains 2 honor': () => true
                }
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'give each player 2 {1}',
            effectArgs: context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor',
            handler: context => {
                let action = 'gainHonor';
                if(context.select === 'Each player gains 2 fate') {
                    action = 'gainFate';
                }
                let gameAction = ability.actions[action](2);
                if(gameAction.setTargets(this.game.getPlayers(), context)) {
                    this.game.openEventWindow(gameAction.getEventArray());
                }
                let card = this.controller.getDynastyCardInProvince(context.cardStateWhenInitiated.location);
                if(card) {
                    card.facedown = false;
                }
            }
        });
    }
}

WindsweptYurt.id = 'windswept-yurt';

module.exports = WindsweptYurt;
