const Event = require('../Events/Event');
const { EventNames } = require('../Constants');

class ReduceableFateCost {
    constructor(playingType) {
        this.playingType = playingType;
    }

    canPay(context) {
        if(context.source.printedCost === null) {
            return false;
        }
        let minCost = context.player.getMinimumCost(this.playingType, context);
        return context.player.fate >= minCost &&
            (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    resolve(context, result) {
        let alternatePools = context.player.getAlternateFatePools(this.playingType, context.source);
        let alternatePoolTotal = alternatePools.reduce((total, pool) => total + pool.fate, 0);
        let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
        if(this.getReducedCost(context) > maxPlayerFate + alternatePoolTotal) {
            result.cancelled = true;
        } else if(!result.cancelled && alternatePools.length > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
            let properties = {
                reducedCost: this.getReducedCost(context),
                remainingPoolTotal: alternatePoolTotal
            };
            context.costs.alternateFate = new Map();
            let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
            for(const alternatePool of alternatePools) {
                context.game.queueSimpleStep(() => {
                    properties.remainingPoolTotal -= alternatePool.fate;
                    properties.minFate = Math.max(properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal, 0);
                    properties.maxFate = Math.min(alternatePool.fate, properties.reducedCost);
                    properties.pool = alternatePool;
                    properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
                    if(result.cancelled || properties.numberOfChoices === 0) {
                        return;
                    }
                    this.promptForAlternateFate(context, result, properties);
                });
            }
        }
    }

    getReducedCost(context) {
        return context.player.getReducedCost(this.playingType, context.source);
    }

    promptForAlternateFate(context, result, properties) {
        let choices = Array.from(Array(properties.numberOfChoices), (x, i) => i + properties.minFate);
        if(result.canCancel) {
            choices.push('Cancel');
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose amount of fate to spend from the ' + properties.pool.name,
            choices: choices,
            choiceHandler: choice => {
                if(choice === 'Cancel') {
                    result.cancelled = true;
                    return;
                }
                if(choice > 0) {
                    context.game.addMessage('{0} takes {1} fate from {2} to pay the cost of {3}', context.player, choice, properties.pool, context.source);
                }
                context.costs.alternateFate.set(properties.pool, choice);
                properties.reducedCost -= choice;
            }
        });
    }

    payEvent(context) {
        const amount = context.costs.fate = this.getReducedCost(context);
        return new Event(EventNames.OnSpendFate, { amount, context }, event => {
            event.context.player.markUsedReducers(this.playingType, event.context.source);
            event.context.player.fate -= this.getFinalFatecost(context, amount);
        });
    }

    getFinalFatecost(context, reducedCost) {
        if(!context.costs.alternateFate) {
            return reducedCost;
        }
        let totalAlternateFate = 0;
        for(let alternatePool of context.player.getAlternateFatePools(this.playingType, context.source)) {
            alternatePool.modifyFate(-context.costs.alternateFate.get(alternatePool));
            totalAlternateFate += context.costs.alternateFate.get(alternatePool);
        }
        return Math.max(reducedCost - totalAlternateFate, 0);
    }
}

module.exports = ReduceableFateCost;
