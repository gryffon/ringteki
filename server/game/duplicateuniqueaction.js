const BaseAction = require('./BaseAction');
const { Phases, PlayTypes } = require('./Constants');

class DuplicateUniqueAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Add fate to a duplicate';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('facedown') && this.card.facedown) {
            return 'facedown';
        }

        if(!ignoredRequirements.includes('phase') && this.card.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        }

        if(!this.card.controller.isCardInPlayableLocation(this.card, PlayTypes.PlayFromProvince) && !this.card.controller.isCardInPlayableLocation(this.card, PlayTypes.PlayFromHand)) {
            if(!ignoredRequirements.includes('location')) {
                return 'location';
            }
        }
        if(!this.card.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source);
    }

    executeHandler(context) {
        let duplicate = context.player.getDuplicateInPlay(context.source);
        context.game.applyGameAction(context, { placeFate: duplicate, discardCard: context.source });
    }
}

module.exports = DuplicateUniqueAction;

