const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCardAction extends BaseAbility {
    constructor() {
        super({
            cost: Costs.playEvent()
        });
        this.title = 'Play';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;
        let currentPrompt = player.currentPrompt();
        if (currentPrompt === undefined) {
            return false
        }

        return (
            game.currentPhase !== 'setup' &&
            source.getType() === 'event' &&
            source.location === 'hand' &&
            source.canBePlayed() &&
            context.source.abilities.actions.length === 0 &&
            currentPrompt.promptTitle.includes('Action Window')
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} costing {2}', context.player, context.source, context.costs.gold);
        //context.source.play(context.player);
    }

    isPlayableEventAbility() {
        return true;
    }
}

module.exports = PlayCardAction;
