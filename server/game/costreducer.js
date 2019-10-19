const _ = require('underscore');
const { PlayTypes } = require('./Constants');

class CostReducer {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.uses = 0;
        this.limit = properties.limit;
        this.cardType = properties.cardType;
        this.match = properties.match || (() => true);
        this.targetCondition = properties.targetCondition;
        this.amount = properties.amount || 1;
        this.playingTypes = properties.playingTypes ? (_.isArray(properties.playingTypes) ? properties.playingTypes : [properties.playingTypes]) : [PlayTypes.PlayFromHand];
        if(this.limit) {
            this.limit.registerEvents(game);
        }
    }

    canReduce(playingType, card, target = null, ignoreType = false) {
        if(this.limit && this.limit.isAtMax(this.source.controller)) {
            return false;
        } else if(!ignoreType && this.cardType && card.getType() !== this.cardType) {
            return false;
        }
        return this.playingTypes.includes(playingType) && !!this.match(card, this.source) && this.checkTargetCondition(target);
    }

    checkTargetCondition(target) {
        if(!this.targetCondition) {
            return true;
        }
        if(!target) {
            return false;
        }

        return this.targetCondition(target, this.source);
    }

    getAmount(card, player) {
        if(_.isFunction(this.amount)) {
            return this.amount(card, player);
        }

        return this.amount;
    }

    markUsed() {
        if(this.limit) {
            this.limit.increment(this.source.controller);
        }
    }

    isExpired() {
        return !!this.limit && this.limit.isAtMax(this.source.controller) && !this.limit.isRepeatable();
    }

    unregisterEvents() {
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CostReducer;
