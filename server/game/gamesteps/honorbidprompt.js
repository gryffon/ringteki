const AllPlayerPrompt = require('./allplayerprompt.js');
const GameActions = require('../GameActions/GameActions');
const { EventNames } = require('../Constants');

class HonorBidPrompt extends AllPlayerPrompt {
    constructor(game, menuTitle, costHandler, prohibitedBids = {}, duel = null) {
        super(game);
        this.menuTitle = menuTitle || 'Choose a bid';
        this.costHandler = costHandler;
        this.prohibitedBids = prohibitedBids;
        this.duel = duel;
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
            this.game.raiseEvent(EventNames.OnHonorDialsRevealed, { duel: this.duel }, () => {
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


    activePrompt(player) {
        let prohibitedBids = this.prohibitedBids[player.uuid] || [];
        let buttons = ['1', '2', '3', '4', '5'].filter(num => !prohibitedBids.includes(num));
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: buttons.map(num => ({ text: num, arg: num }))
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
