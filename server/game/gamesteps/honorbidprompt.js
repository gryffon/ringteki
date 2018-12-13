const AllPlayerPrompt = require('./allplayerprompt.js');
const GameActions = require('../GameActions/GameActions');
const { EventNames } = require('../Constants');

class HonorBidPrompt extends AllPlayerPrompt {
    constructor(game, menuTitle, costHandler) {
        super(game);
        this.menuTitle = menuTitle || 'Choose a bid';
        this.costHandler = costHandler;
        this.bid = {};
    }

    activeCondition(player) {
        return !this.bid[player.uuid];
    }

    completionCondition(player) {
        return this.bid[player.uuid] > 0;
    }

    continue() {
        let completed = super.continue();

        if(completed) {
            this.game.raiseEvent(EventNames.OnHonorDialsRevealed, {}, () => {
                for(const player of this.game.getPlayers()) {
                    player.honorBidModifier = 0;
                    this.game.actions.setHonorDial({ value: this.bid[player.uuid]}).resolve(player, this.game.getFrameworkContext());
                }
            });
            if(this.costHandler) {
                this.game.queueSimpleStep(() => this.costHandler(this));
            } else {
                this.game.queueSimpleStep(() => this.transferHonorAfterBid());
            }
        }

        return completed;
    }

    transferHonorAfterBid(context = this.game.getFrameworkContext()) {
        let firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer.opponent) {
            return;
        }
        let difference = firstPlayer.honorBid - firstPlayer.opponent.honorBid;
        if(difference > 0) {
            this.game.addMessage('{0} gives {1} {2} honor', firstPlayer, firstPlayer.opponent, difference);
            GameActions.takeHonor({ amount: difference, afterBid: true }).resolve(firstPlayer, context);
        } else if(difference < 0) {
            this.game.addMessage('{0} gives {1} {2} honor', firstPlayer.opponent, firstPlayer, -difference);
            GameActions.takeHonor({ amount: -difference, afterBid: true }).resolve(firstPlayer.opponent, context);
        }
    }


    activePrompt() {
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: [
                { text: '1', arg: '1' },
                { text: '2', arg: '2' },
                { text: '3', arg: '3' },
                { text: '4', arg: '4' },
                { text: '5', arg: '5' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose a bid.' };
    }

    menuCommand(player, bid) {
        this.game.addMessage('{0} has chosen a bid.', player);

        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

module.exports = HonorBidPrompt;
