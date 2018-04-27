const DrawCard = require('../../drawcard.js');

class EmbraceTheVoid extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onCardMoveFate: (event, context) => event.origin === context.source.parent && event.fate > 0
            },
            effect: 'take the {1} fate being removed from {0}',
            effectItems: context => context.event.fate,
            handler: context => context.event.recipient = context.player
        });
    }
    
    canPlay(context) {
        if(!this.controller.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }
        
        return super.canPlay(context);
    }
}

EmbraceTheVoid.id = 'embrace-the-void';

module.exports = EmbraceTheVoid;
