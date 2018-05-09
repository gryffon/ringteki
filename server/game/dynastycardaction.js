const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');

class DynastyCardAction extends BaseAction {
    constructor(card) {
        super(card, [
            Costs.chooseFate(),
            Costs.payReduceableFateCost('play'),
            Costs.playLimited()
        ]);
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext()) {
        this.originalLocation = this.card.location;
        if(context.game.currentPhase !== 'dynasty') {
            return 'phase';
        }
        if(!context.player.isCardInPlayableLocation(this.card, 'dynasty')) {
            return 'location';
        }
        if(!this.card.canPlay(context)) {
            return 'cannotTrigger';
        }
        if(this.card.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.chooseFate);
    }

    executeHandler(context) {
        let events = context.game.applyGameAction(context, { putIntoPlay: context.source }, [{
            name: 'onCardPlayed',
            params: { player: context.player, card: context.source, originalLocation: context.source.location }
        }]);
        events[0].fate = context.chooseFate;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = DynastyCardAction;
