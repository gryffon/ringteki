const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class EmbraceTheVoid extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onMoveFate: (event, context) =>
                    event.origin === context.source.parent && event.fate > 0 && event.recipient !== context.player
            },
            effect: 'take the {1} fate being removed from {2}',
            effectArgs: context => [context.event.fate, context.source.parent],
            handler: context => context.event.recipient = context.player
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

EmbraceTheVoid.id = 'embrace-the-void';

module.exports = EmbraceTheVoid;
