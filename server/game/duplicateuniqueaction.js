const BaseAction = require('./BaseAction');

class DuplicateUniqueAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Add fate to a duplicate';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('facedown') && this.card.facedown) {
            return 'facedown';
        }

        if(!ignoredRequirements.includes('phase') && this.card.game.currentPhase !== 'dynasty') {
            return 'phase';
        }

        if(!this.card.controller.isCardInPlayableLocation(this.card, 'playFromProvince') && !this.card.controller.isCardInPlayableLocation(this.card, 'playFromHand')) {
            if(!ignoredRequirements.includes('location')) {
                return 'location';
            }
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source);
    }

    executeHandler(context) {
        let duplicate = context.player.getDuplicateInPlay(context.source);
        context.player.moveCard(context.source, context.source.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
        context.game.applyGameAction(context, { placeFate: duplicate });
    }
}

module.exports = DuplicateUniqueAction;

