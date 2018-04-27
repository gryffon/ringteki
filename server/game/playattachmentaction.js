const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');

class PlayAttachmentAction extends BaseAction {
    constructor(card) {
        super(card, [Costs.payReduceableFateCost('play'), Costs.playLimited()], { 
            cardCondition: (card, context) => context.player.canAttach(context.source, card) && context.source.canPlayOn(card)
        });
        this.title = 'Play this attachment';
    }
    
    meetsRequirements(context = this.createContext()) {
        if(context.game.currentPhase === 'dynasty') {
            return 'phase';
        }
        if(!context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        if(!context.source.canPlay(context)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }

    executeHandler(context) {
        this.originalLocation = context.source.location;
        context.player.attach(context.source, context.target, true);
    }
    
    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentAction;

