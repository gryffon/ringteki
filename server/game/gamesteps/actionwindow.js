const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

class ActionWindow extends UiPrompt {
    constructor(game, title, windowName) {
        super(game);

        this.title = title;
        this.windowName = windowName;
        this.currentPlayer = game.getFirstPlayer();
        this.prevPlayerPassed = false;
        /*
        if (!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.prevPlayerPassed = true;
            this.nextPlayer();
        }
        */
    }
    
    activeCondition(player) {
        return player === this.currentPlayer;
    }

    continue() {
        let completed = super.continue();

        if(!completed) {
            this.game.currentActionWindow = this;
        } else {
            this.game.currentActionWindow = null;
        }

        return completed;
    }

    activePrompt() {
        return {
            menuTitle: 'Initiate an action',
            buttons: [
                { text: 'Pass' }
            ],
            promptTitle: this.title
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to take an action or pass.' };
    }

    skipCondition(player) {
        return !this.forceWindow && !player.promptedActionWindows[this.windowName];
    }

    onMenuCommand(player) {
        if(this.currentPlayer !== player) {
            return false;
        }
        
        if(this.prevPlayerPassed) {
            this.complete();
            return true;
        }

        this.prevPlayerPassed = true;
        this.nextPlayer()

        return true;
    }
    
    nextPlayer() {
        let otherplayer = _.find(this.game.getPlayers(), !this.currentPlayer);
        
        if (!otherplayer || !otherplayer.promptedActionWindows[this.windowName]) {
            if (this.prevPlayerPassed) {
                this.complete();
            }
        } else {
            this.currentPlayer = otherplayer;
        }
    }

    markActionAsTaken() {
        this.prevPlayerPassed = false;
        this.nextPlayer();
    }

    rotatedPlayerOrder(player) {
        var players = this.game.getPlayersInFirstPlayerOrder();
        var splitIndex = players.indexOf(player);
        var beforePlayer = players.slice(0, splitIndex);
        var afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

module.exports = ActionWindow;
