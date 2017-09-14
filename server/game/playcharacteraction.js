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
        let currentPrompt = player.currentPrompt();
        if (currentPrompt === undefined) {
            return false
        }

        return (
            game.currentPhase !== 'dynasty' &&
            source.getType() === 'character' &&
            source.location === 'hand' &&
            currentPrompt.promptTitle.includes('Action Window')
        );
    }

    executeHandler(context) {
        
        let extrafate = this.cost[0].fate;
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source.name, extrafate);

        // need to add an additional selection prompt if conflict ongoing
        context.player.playCharacterWithFate(context.source, extrafate);
        if (context.game.currentConflict) {
            context.game.promptWithMenu(context.player, context.player, {
                activePrompt: {
                    promptTitle: context.source.name,
                    menuTitle: 'Where do you wish to play this character?',
                    buttons: [
                        { text: 'Conflict', arg: context.source.uuid, method: 'moveToConflict' },
                        { text: 'Home', arg: '', method: 'moveToConflict' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to take an action or pass.'
            });
        }
    }
    
    moveToConflict(player, arg) {
        if (arg !== '') {
            let card = player.findCardInPlayByUuid(arg);
            card.inConflict = true;
            player.game.currentConflict.attackers.push(card);
        }
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayCharacterAction;

