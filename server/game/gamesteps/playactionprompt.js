const BaseStep = require('./basestep.js');

class PlayActionPrompt extends BaseStep {
    constructor(game, player, playActions, context) {
        super(game);
        this.player = player;
        this.playActions = playActions;
        this.context = context;
    }

    continue() {
        var index = 0;
        var buttons = this.playActions.map(action => {
            var button = { text: action.title, method: 'selectAction', arg: index };
            index++;
            return button;
        });

        let menuTitle = 'Play ' + this.context.source.name + ':';
        if(this.context.source.location === 'play area') {
            menuTitle = 'Choose an ability:';
        }

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: menuTitle,
                buttons: buttons
            },
            source: this.context.source
        });
    }

    selectAction(player, index) {
        this.context.ability = this.playActions[index];
        this.game.resolveAbility(this.context);
        return true;
    }
}

module.exports = PlayActionPrompt;
