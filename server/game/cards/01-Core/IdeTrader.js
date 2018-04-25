const DrawCard = require('../../drawcard.js');

class IdeTrader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a fate/card',
            when: {
                onMoveCharactersToConflict: (event, context) => context.source.isParticipating()
            },
            limit: ability.limit.perConflict(1),
            target: {
                mode: 'select',
                choices: {
                    'Gain 1 fate': () => true,
                    'Draw 1 card': () => true
                }
            },
            handler: context => {
                if(context.select === 'Gain 1 fate') {
                    this.game.addMessage('{0} uses {1} to gain 1 fate', context.player, context.source);
                    this.game.addFate(context.player, 1);
                } else {
                    this.game.addMessage('{0} uses {1} to draw 1 card', context.player, context.source);
                    context.player.drawCardsToHand(1);
                }
            }        
        });
    }
}

IdeTrader.id = 'ide-trader';

module.exports = IdeTrader;
