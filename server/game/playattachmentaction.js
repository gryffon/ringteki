const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayAttachmentAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ] 
        });
        this.title = 'PlayAttachmentAction';
        this.targets = { 
            target: {
             cardCondition: this.cardCondition
            }
        };
    }
    
    cardCondition(card, context) {
        return context.source.owner.canAttach(context.source, card);
    }

    meetsRequirements(context) {
        var {game, player, source} = context;
        let currentprompt = player.currentPrompt();

        return (
            game.currentPhase !== 'dynasty' &&
            source.getType() === 'attachment' &&
            source.location === 'hand' &&
            game.actionWindow &&
            game.actionWindow.currentPlayer === player &&
            currentprompt.menuTitle === 'Initiate an action'
        );
    }

    executeHandler(context) {
                let targetPlayer = context.target.controller;
                targetPlayer.attach(context.player, context.source, context.target, 'play');
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayAttachmentAction;

