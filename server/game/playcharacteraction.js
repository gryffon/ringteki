const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const ChooseFate = require('./costs/choosefate.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                new ChooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ]
        });
        this.title = 'PlayCharacterAction';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;
        let currentprompt = player.currentPrompt();

        return (
            game.currentPhase !== 'dynasty' &&
            source.getType() === 'character' &&
            source.location === 'hand' &&
            player.canPutIntoPlay(source) &&
            game.actionWindow &&
            game.actionWindow.currentPlayer === player &&
            currentprompt.menuTitle === 'Initiate an action'
        );
    }

    executeHandler(context) {
        
        let extrafate = this.cost[0].fate;
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source.name, extrafate);

        // need to add an additional selection prompt if conflict ongoing
        context.player.playCharacterWithFate(context.source, extrafate);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayCharacterAction;

