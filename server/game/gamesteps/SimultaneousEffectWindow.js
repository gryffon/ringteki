const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class DelayedAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game) {
        super(game, { event: [] });
    }
    // Special window: Ring Effects (has a context), Delayed Effects

    continue() {
        return this.filterChoices();
    }

    filterChoices() {
        let choices = this.choices.filter(choice => choice.condition())
        if(choices.length === 0) {
            return true;
        }
        if(choices.length === 1) {
            choices[0].handler();
        } else {
            this.promptBetweenChoices(choices);
        }
        return false;
    }

    promptBetweenChoices(choices) {
        this.game.promptWithHandlerMenu(this.currentPlayer, {
            source: 'Order Simultaneous effects',
            activePromptTitle: 'Choose an effect to be resolved',
            waitingPromptTitle: 'Waiting for opponent',
            choices: _.map(choices, choice => choice.title),
            handlers: _.map(choices, choice => choice.handler)
        });
    }

}

module.exports = ForcedTriggeredAbilityWindow;
