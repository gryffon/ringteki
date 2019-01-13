const _ = require('underscore');
const { Locations, EffectNames, DuelTypes } = require('./Constants');

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
    }

    getSkillTotal(card) {
        if(card.location === Locations.PlayArea) {
            switch(this.type) {
                case DuelTypes.Military:
                    return card.getMilitarySkill(this.bidFinished);
                case DuelTypes.Political:
                    return card.getPoliticalSkill(this.bidFinished);
                case DuelTypes.Glory:
                    return card.glory;
                case DuelTypes.BaseMilitary:
                    return card.getBaseMilitarySkill(this.bidFinished);
                case DuelTypes.BasePolitical:
                    return card.getBasePoliticalSkill(this.bidFinished);
            }
        }
        return '-';
    }

    isInvolved(card) {
        return (card === this.challenger || card === this.target) && card.location === Locations.PlayArea;
    }

    getTotalsForDisplay() {
        return this.challenger.name + ': ' + this.getSkillTotal(this.challenger).toString() + ' vs ' + this.getSkillTotal(this.target).toString() + ': ' + this.target.name;
    }

    modifyDuelingSkill() {
        this.bidFinished = true;
        let cards = [this.challenger, this.target].filter(card => card.location === Locations.PlayArea);
        let typeToEffect = {
            military: EffectNames.ModifyDuelMilitarySkill,
            political: EffectNames.ModifyDuelPoliticalSkill,
            glory: EffectNames.ModifyDuelGlory,
            baseMilitary: EffectNames.ModifyDuelBaseMilitarySkill,
            basePolitical: EffectNames.ModifyDuelBasePoliticalSkill
        };
        _.each(cards, card => {
            this.source.untilEndOfDuel(ability => ({
                match: card,
                effect: ability.effects[typeToEffect[this.type]](parseInt(card.controller.honorBid))
            }));
        });
        this.game.checkGameState(true);
    }

    determineResult() {
        let challengerTotal = this.getSkillTotal(this.challenger);
        let targetTotal = this.getSkillTotal(this.target);
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
        if(this.loser && !this.loser.checkRestrictions('loseDuels')) {
            this.loser = null;
        }
    }
}

module.exports = Duel;
