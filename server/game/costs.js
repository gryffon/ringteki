const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');
const CostBuilders = require('./costs/CostBuilders.js');

const Costs = {
    /**
     * Cost that allows the player to choose between multiple costs. The
     * `choices` object should have string keys representing the button text
     * that will be used to prompt the player, with the values being the cost
     * associated with that choice.
     */
    choose: choices => new ChooseCost(choices),
    /**
     * Cost that will bow the card that initiated the ability.
     */
    bowSelf: () => CostBuilders.bow.self(),
    /**
     * Cost that will bow the card that the card that initiated the ability is attached to.
     */
    bowParent: () => CostBuilders.bow.parent(),
    /**
     * Cost that requires bowing a card that matches the passed condition
     * predicate function.
     */
    bow: condition => CostBuilders.bow.select(condition),
    /**
     * Cost that requires bowing a certain number of cards that match the
     * passed condition predicate function.
     */
    bowMultiple: (amount, condition) => CostBuilders.bow.selectMultiple(amount, condition),
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: () => CostBuilders.sacrifice.self(),
    /**
     * Cost that will sacrifice a specified card.
     */
    sacrificeSpecific: cardFunc => CostBuilders.sacrifice.specific(cardFunc),
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: condition => CostBuilders.sacrifice.select(condition),
    /**
     * Cost that will return a selected card to hand which matches the passed
     * condition.
     */
    returnToHand: condition => CostBuilders.returnToHand.select(condition),
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: () => CostBuilders.returnToHand.self(),
    /**
     * Cost that requires discarding a specific card.
     */
    discardCardSpecific: cardFunc => CostBuilders.discardCard.specific(cardFunc),
    /**
     * Cost that requires discarding a card to be selected by the player.
     */
    discardCard: condition => CostBuilders.discardCard.select(condition),
    /**
     * Cost that will discard a fate from the card
     */
    removeFateFromSelf: () => CostBuilders.removeFate.self(),
    /**
     * Cost that will discard a fate from a selected card
     */
    removeFate: condition => CostBuilders.removeFate.select(condition),
    /**
     * Cost that will discard a fate from the card's parent
     */
    removeFateFromParent: () => CostBuilders.removeFate.parent(),
    /**
     * Cost that will dishonor the character that initiated the ability
     */
    dishonorSelf: () => CostBuilders.dishonor.self(),
    /**
     * Cost that requires dishonoring a card that matches the passed condition
     * predicate function
     */
    dishonor: condition => CostBuilders.dishonor.select(condition),
    /**
     * Cost that will break the province that initiated the ability
     */
    breakSelf: () => CostBuilders.break.self(),
    /**
     * Cost that will put into play the card that initiated the ability
     */
    putSelfIntoPlay: () => CostBuilders.putIntoPlay.self(),
    /**
     * Cost that will reveal specific cards
     */
    reveal: (cardFunc) => CostBuilders.reveal.specific(cardFunc),
    /**
     * Cost that discards the Imperial Favor
     */
    discardImperialFavor: () => CostBuilders.discardImperialFavor(),
    /**
     * Cost that ensures that the player can still play a Limited card this
     * round.
     */
    playLimited: function() {
        return {
            canPay: function(context) {
                return !context.source.isLimited() || context.player.limitedPlayed < context.player.maxLimited;
            },
            pay: function(context) {
                if(context.source.isLimited()) {
                    context.player.limitedPlayed += 1;
                }
            },
            canIgnoreForTargeting: true
        };
    },

    /**
     * Cost that represents using your action in an ActionWindow
     */
    useInitiateAction: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.game.markActionAsTaken();
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the exact printed fate cost for the card.
     */
    payPrintedFateCost: function() {
        return {
            canPay: function(context) {
                let amount = context.source.getCost();
                return context.player.fate >= amount && (amount === 0 || context.player.checkRestrictions('spendFate', context));
            },
            pay: function(context) {
                context.player.fate -= context.source.getCost();
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the printed fate cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableFateCost: function(playingType) {
        return {
            canPay: function(context) {
                let reducedCost = context.player.getMinimumCost(playingType, context.source);
                return context.player.fate >= reducedCost && (reducedCost === 0 || context.player.checkRestrictions('spendFate', context));
            },
            resolve: function(context, result) {
                context.game.raiseEvent('onResolveFateCost', { card: context.source });
                context.game.queueSimpleStep(() => {
                    let reducedCost = context.player.getReducedCost(playingType, context.source);
                    let alternatePool = context.player.getAlternateFatePool(playingType, context.source);
                    let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
                    if(reducedCost > maxPlayerFate + (alternatePool ? alternatePool.fate : 0)) {
                        result.cancelled = true;
                        return;
                    }
                    if(alternatePool && alternatePool.fate > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
                        let minFateFromAlternate = Math.max(reducedCost - maxPlayerFate, 0);
                        let maxFateFromAlternate = Math.min(alternatePool.fate, reducedCost);
                        let numberOfChoices = maxFateFromAlternate - minFateFromAlternate;
                        if(numberOfChoices > 0) {
                            let choices = Array.from(Array(numberOfChoices), (x, i) => i + minFateFromAlternate);
                            context.game.promptWithHandlerMenu(context.player, {
                                activePromptTitle: 'Choose amount of fate to spend from ' + alternatePool.name,
                                choices: choices,
                                choiceHandler: choice => context.costs.alternateFate = choice
                            });
                        }
                    }
                });
            },
            pay: function(context) {
                context.costs.fate = context.player.getReducedCost(playingType, context.source);
                context.player.markUsedReducers(playingType, context.source);
                if(context.costs.alternateFate) {
                    let alternatePool = context.player.getAlternateFatePool(playingType, context.source);
                    alternatePool.modifyFate(-context.costs.alternateFate);
                }
                context.player.fate -= context.costs.fate;
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that is dependent on context.targets[targetName]
     */
    payTargetDependentFateCost: function(targetName, playingType) {
        return {
            dependsOn: targetName,
            canPay: function(context) {
                if(!context.targets[targetName]) {
                    // we don't need to check now because this will be checked again once targeting is done
                    return true;
                }
                let reducedCost = context.player.getMinimumCost(playingType, context.source, context.targets[targetName]);
                return context.player.fate >= reducedCost && (reducedCost === 0 || context.player.checkRestrictions('spendFate', context));
            },
            resolve: function(context, result) {
                context.game.raiseEvent('onResolveFateCost', { card: context.source });
                context.game.queueSimpleStep(() => {
                    let reducedCost = context.player.getReducedCost(playingType, context.source, context.targets[targetName]);
                    let alternatePool = context.player.getAlternateFatePool(playingType, context.source);
                    let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
                    if(reducedCost > maxPlayerFate + (alternatePool ? alternatePool.fate : 0)) {
                        result.cancelled = true;
                        return;
                    }
                    if(alternatePool && alternatePool.fate > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
                        let minFateFromAlternate = Math.max(reducedCost - maxPlayerFate, 0);
                        let maxFateFromAlternate = Math.min(alternatePool.fate, reducedCost);
                        let numberOfChoices = maxFateFromAlternate - minFateFromAlternate;
                        if(numberOfChoices > 0) {
                            let choices = Array.from(Array(numberOfChoices), (x, i) => i + minFateFromAlternate);
                            context.game.promptWithHandlerMenu(context.player, {
                                activePromptTitle: 'Choose amount of fate to spend from ' + alternatePool.name,
                                choices: choices,
                                choiceHandler: choice => context.costs.alternateFate = choice
                            });
                        }
                    }
                });
            },
            pay: function(context) {
                context.costs.targetDependentFate = context.player.getReducedCost(playingType, context.source, context.targets[targetName]);
                context.player.markUsedReducers(playingType, context.source, context.targets[targetName]);
                if(context.costs.alternateFate) {
                    let alternatePool = context.player.getAlternateFatePool(playingType, context.source);
                    alternatePool.modifyFate(-context.costs.alternateFate);
                }
                context.player.fate -= context.costs.targetDependentFate;
            }
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of fate.
     */
    payFate: (amount) => CostBuilders.payFate(amount),
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of honor.
     */
    payHonor: (amount) => CostBuilders.payHonor(amount),
    /**
     * Cost where a character must spend fate to an unclaimed ring
     */
    payFateToRing: (amount = 1, ringCondition = ring => ring.isUnclaimed()) => CostBuilders.payFateToRing(amount, ringCondition),
    giveFateToOpponent: (amount = 1) => CostBuilders.giveFateToOpponent(amount),
    chooseFate: function () {
        return {
            canPay: function() {
                return true;
            },
            resolve: function(context, result) {
                let extrafate = context.player.fate - context.player.getReducedCost('play', context.source);
                if(!context.player.checkRestrictions('placeFateWhenPlayingCharacter', context) || !context.player.checkRestrictions('spendFate', context)) {
                    extrafate = 0;
                }
                let choices = [];
                let max = 3;
                context.chooseFate = 0;
                for(let i = 0; i <= Math.min(extrafate, max); i++) {
                    choices.push(i);
                }
                let handlers = _.map(choices, fate => {
                    return () => context.chooseFate += fate;
                });

                if(extrafate > max) {
                    choices[3] = 'More';
                    handlers[3] = () => {
                        max += 3;
                        context.chooseFate += 3;
                        let zip = _.zip(choices, handlers);
                        zip = _.filter(zip, array => {
                            let choice = array[0];
                            if(choice === 'Cancel') {
                                return true;
                            } else if(choice === 'More') {
                                return extrafate >= max;
                            }
                            return extrafate >= choice + 3;
                        });
                        [choices, handlers] = _.unzip(_.map(zip, array => {
                            let [choice, handler] = array;
                            if(_.isNumber(choice)) {
                                return [choice + 3, handler];
                            }
                            return [choice, handler];
                        }));
                        context.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Choose additional fate',
                            source: context.source,
                            choices: _.map(choices, choice => _.isString(choice) ? choice : choice.toString()),
                            handlers: handlers
                        });
                    };
                }
                if(result.canCancel) {
                    choices.push('Cancel');
                    handlers.push(() => {
                        result.cancelled = true;
                    });
                }

                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose additional fate',
                    source: context.source,
                    choices: _.map(choices, choice => _.isString(choice) ? choice : choice.toString()),
                    handlers: handlers
                });
            },
            pay: function(context) {
                context.player.fate -= context.chooseFate;
            },
            promptsPlayer: true
        };
    }
};

module.exports = Costs;
