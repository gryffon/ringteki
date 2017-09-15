const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const ChooseFate = require('./costs/choosefate.js');

class DynastyCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                new ChooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ]
        });
        this.title = 'Dynasty';
    }

    meetsRequirements(context) {
        let currentPrompt = context.player.currentPrompt();
        if(currentPrompt === undefined) {
            return false;
        }

        return (
            !context.source.facedown &&
            context.source.isDynasty &&
            context.source.getType() === 'character' &&
            context.player.isCardInPlayableLocation(context.source, 'dynasty') &&
            context.player.canPutIntoPlay(context.source) &&
            currentPrompt.promptTitle === 'Play cards from provinces'
        );
    }

    executeHandler(context) {
        
        let extrafate = this.cost[0].fate;
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source.name, extrafate);

        context.player.playCharacterWithFate(context.source, extrafate);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DynastyCardAction;
