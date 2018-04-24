const BaseAbility = require('../baseability.js');

class EarthRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                mode: 'select',
                activePromptTitle: 'Choose an effect to resolve',
                source: 'Earth Ring',
                choices: {
                    'Draw a card and opponent discards': () => true,
                    'Don\'t resolve': () => optional
                }
            }
        });
        this.title = 'Earth Ring Effect';
        this.cannotTargetFirst = true;
        this.defaultPriority = 1; // Default resolution priority when players have ordering switched off
    }

    executeHandler(context) {
        if(context.select === 'Don\'t resolve') {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'earth');

          
            return;
        }
        if(context.player.opponent) {
            context.game.addMessage('{0} resolves the {1} ring, drawing a card and forcing {2} to discard a card at random', context.player, 'earth', context.player.opponent);
            context.player.opponent.discardAtRandom(1, 'Earth Ring');
        } else {
            context.game.addMessage('{0} resolves the {1} ring, drawing a card', context.player, 'earth');
        }
        context.player.drawCardsToHand(1);
    }
}

module.exports = EarthRingEffect;
