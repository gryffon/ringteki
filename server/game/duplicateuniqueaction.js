const BaseAbility = require('./baseability.js');

class DuplicateUniqueAction extends BaseAbility {
    constructor() {
        super([]);
        this.title = 'DuplicateUniqueAction';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'dynasty' &&
            source.getType() === 'character' &&
            (player.isCardInPlayableLocation(source, 'dynasty') || player.isCardInPlayableLocation(source, 'play')) &&
            !player.canPutIntoPlay(source)
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

