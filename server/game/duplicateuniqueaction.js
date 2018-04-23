const BaseAction = require('./BaseAction');

class DuplicateUniqueAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Add fate to a duplicate';
    }

    meetsRequirements(context = this.createContext()) {
        if(this.card.game.currentPhase !== 'dynasty') {
            return 'phase';
        }
        
        if(!this.card.controller.isCardInPlayableLocation(this.card, 'dynasty') && !this.card.controller.isCardInPlayableLocation(this.card, 'play')) {
            return 'location';
        }
        return super.meetsRequirements(context);
    }
    
    executeHandler(context) {
        let duplicate = context.player.getDuplicateInPlay(context.source);        
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source.name);
        context.player.moveCard(context.source, context.source.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
        context.game.applyGameAction(context, { placeFate: duplicate });
    }
}

module.exports = DuplicateUniqueAction;

