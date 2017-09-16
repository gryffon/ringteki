const BaseAbility = require('./baseability.js');

class DuplicateUniqueAction extends BaseAbility {
    constructor() {
        super([]);
        this.title = 'DuplicateUniqueAction';
    }

    meetsRequirements(context) {
        let currentPrompt = context.player.currentPrompt();
        if(currentPrompt.promptTitle === undefined) {
            return false;
        }

        return (
            !context.source.facedown &&
            context.source.isDynasty &&
            context.source.getType() === 'character' &&
            (context.player.isCardInPlayableLocation(context.source, 'dynasty') || context.player.isCardInPlayableLocation(context.source, 'hand')) &&
            !context.player.canPutIntoPlay(context.source) &&
            currentPrompt.promptTitle === 'Play cards from provinces'
        );
    }
    
    executeHandler(context) {
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source.name);
        
        context.player.addFateToDuplicate(context.source);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DuplicateUniqueAction;

