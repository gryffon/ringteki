const _ = require('underscore');
const { Locations } = require('./Constants');

class Duel {
    constructor(game, challenger, target, type) {
        this.game = game;
        this.type = type;
        this.source = game.getFrameworkContext().source;
        this.challenger = challenger;
        this.target = target;
        this.bidFinished = false;
        this.winnner = null;
        this.loser = null;
        this.statistic = (card) => 0; // eslint-disable-line no-unused-vars
    }

    getSkillStatistic(card) {
        if(this.type === 'military') {
            return card.getMilitarySkill(this.bidFinished);
        } else if(this.type === 'political') {
            return card.getPoliticalSkill(this.bidFinished);
        } else if(this.type === 'glory') {
            return card.glory;
        }
        return this.statistic(card);
    }

    isInvolved(card) {
        return (card === this.challenger || card === this.target || this.target.includes(card)) && card.location === Locations.PlayArea;
    }

    getTotalsForDisplay() {
        return this.challenger.name + ': ' + this.getChallengerStatisticTotal().toString() + ' vs ' + this.getTargetStatisticTotal().toString() + ': ' + this.getTargetName();
    }

    getChallengerStatisticTotal() {
        if(this.challenger.location !== Locations.PlayArea) {
            return '-';
        }
        let total = this.getSkillStatistic(this.challenger);
        total += this.bidFinished ? this.challenger.controller.honorBid : 0;
        return total;
    }

    getTargetStatisticTotal() {
        if(this.target.every(card => card.location !== Locations.PlayArea)) {
            return '-';
        }
        let total = this.target.reduce((sum, card) => sum + this.getSkillStatistic(card), 0);
        total += this.bidFinished ? this.challenger.controller.opponent.honorBid : 0;
        return total;
    }

    getTargetName() {
        return this.target.map((card) => card.name).join(' and ');
    }

    modifyDuelingSkill() {
        this.bidFinished = true;
    }

    determineResult() {
        let challengerTotal = this.getChallengerStatisticTotal();
        let targetTotal = this.getTargetStatisticTotal();
        if(challengerTotal === '-') {
            if(targetTotal !== '-' && targetTotal > 0) {
                // Challenger dead, target alive
                this.winner = this.target;
            }
            // Both dead
        } else if(targetTotal === '-') {
            // Challenger alive, target dead
            if(challengerTotal > 0) {
                this.winner = this.challenger;
            }
        } else if(challengerTotal > targetTotal) {
            // Both alive, challenger wins
            this.winner = this.challenger;
            this.loser = this.target;
        } else if(challengerTotal < targetTotal) {
            // Both alive, target wins
            this.winner = this.target;
            this.loser = this.challenger;
        }
        if(Array.isArray(this.loser)) {
            this.loser = _.reject(this.loser, (card) => !card.checkRestrictions('loseDuels'));
            if(this.loser.length === 0) {
                this.loser = null;
            } else if(this.loser.length === 1) {
                this.loser = this.loser[0];
            }
        } else {
            if(this.loser && !this.loser.checkRestrictions('loseDuels')) {
                this.loser = null;
            }
        }
        if(Array.isArray(this.winner)) {
            if(this.winner.length === 0) {
                this.winner = null;
            } else if(this.winner.length === 1) {
                this.winner = this.winner[0];
            }
        }
    }
}

module.exports = Duel;
