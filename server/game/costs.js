const _ = require('underscore');
const ReduceableFateCost = require('./costs/ReduceableFateCost');
const TargetDependentFateCost = require('./costs/TargetDependentFateCost');
const GameActions = require('./GameActions/GameActions');
const GameActionCost = require('./costs/GameActionCost');
const MetaActionCost = require('./costs/MetaActionCost');
const Event = require('./Events/Event');
const { EventNames, Locations } = require('./Constants');

function getSelectCost(action, properties, activePromptTitle) {
    return new MetaActionCost(GameActions.selectCard(Object.assign({ gameAction: action }, properties)), activePromptTitle);
}

const Costs = {
    /**
     * Cost that will bow the card that initiated the ability.
     */
    bowSelf: () => new GameActionCost(GameActions.bow()),
    /**
     * Cost that will bow the card that the card that initiated the ability is attached to.
     */
    bowParent: () => new GameActionCost(GameActions.bow(context => ({ target: context.source.parent }))),
    /**
     * Cost that requires bowing a card that matches the passed condition
     * predicate function.
     */
    bow: properties => getSelectCost(GameActions.bow(), properties, 'Select card to bow'),
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: () => new GameActionCost(GameActions.sacrifice()),
    /**
     * Cost that will sacrifice a specified card.
     */
    sacrificeSpecific: cardFunc => new GameActionCost(GameActions.sacrifice(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: properties => getSelectCost(GameActions.sacrifice(), properties, 'Select card to sacrifice'),
    /**
     * Cost that will return a selected card to hand which matches the passed
     * condition.
     */
    returnToHand: properties => getSelectCost(GameActions.returnToHand(), properties, 'Select card to return to hand'),
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: () => new GameActionCost(GameActions.returnToHand()),
    /**
     * Cost that will shuffle a selected card into the relevant deck which matches the passed
     * condition.
     */
    shuffleIntoDeck: properties => getSelectCost(
        GameActions.moveCard({ destination: Locations.DynastyDeck, shuffle: true }),
        properties,
        'Select card to shuffle into deck'
    ),
    /**
     * Cost that requires discarding a specific card.
     */
    discardCardSpecific: cardFunc => new GameActionCost(GameActions.discardCard(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that requires discarding a card to be selected by the player.
     */
    discardCard: properties => getSelectCost(GameActions.discardCard(), properties, 'Select card to discard'),
    /**
     * Cost that will discard a fate from the card
     */
    removeFateFromSelf: () => new GameActionCost(GameActions.removeFate()),
    /**
     * Cost that will discard a fate from a selected card
     */
    removeFate: properties => getSelectCost(GameActions.removeFate(), properties, 'Select character to discard a fate from'),
    /**
     * Cost that will discard a fate from the card's parent
     */
    removeFateFromParent: () => new GameActionCost(GameActions.removeFate(context => ({ target: context.source.parent }))),
    /**
    * Cost that requires removing a card selected by the player from the game.
    */
    removeFromGame: properties => getSelectCost(GameActions.removeFromGame(), properties, 'Select card to remove from game'),
    /**
     * Cost that will dishonor the character that initiated the ability
     */
    dishonorSelf: () => new GameActionCost(GameActions.dishonor()),
    /**
     * Cost that requires dishonoring a card to be selected by the player
     */
    dishonor: properties => getSelectCost(GameActions.dishonor(), properties, 'Select character to dishonor'),
    /**
     * Cost that will discard the status token on a card to be selected by the player
     */
    discardStatusToken: properties => new MetaActionCost(
        GameActions.selectCard(
            Object.assign({ gameAction: GameActions.discardStatusToken(), subActionProperties: card => ({ target: card.personalHonor }) }, properties)
        ),
        'Select character to discard honored status token from'
    ),
    /**
     * Cost that will break the province that initiated the ability
     */
    breakSelf: () => new GameActionCost(GameActions.break()),
    /**
     * Cost that will put into play the card that initiated the ability
     */
    putSelfIntoPlay: () => new GameActionCost(GameActions.putIntoPlay()),
    /**
     * Cost that will reveal specific cards
     */
    reveal: (cardFunc) => new GameActionCost(GameActions.reveal(context => ({ target: cardFunc(context) }))),
    /**
     * Cost that discards the Imperial Favor
     */
    discardImperialFavor: () => new GameActionCost(GameActions.loseImperialFavor(context => ({ target: context.player }))),
    /**
     * Cost that will pay the exact printed fate cost for the card.
     */
    payPrintedFateCost: function () {
        return {
            canPay: function (context) {
                let amount = context.source.getCost();
                return context.player.fate >= amount && (amount === 0 || context.player.checkRestrictions('spendFate', context));
            },
            payEvent: function (context) {
                const amount = context.source.getCost();
                return new Event(EventNames.OnSpendFate, { amount, context }, event => event.context.player.fate -= event.amount);
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the printed fate cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableFateCost: (playingType, ignoreType = false) => new ReduceableFateCost(playingType, ignoreType),
    /**
     * Cost that is dependent on context.targets[targetName]
     */
    payTargetDependentFateCost: (targetName, playingType, ignoreType = false) => new TargetDependentFateCost(playingType, targetName, ignoreType),
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of fate.
     */
    payFate: (amount = 1) => new GameActionCost(GameActions.loseFate(context => ({ target: context.player, amount }))),
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of honor.
     */
    payHonor: (amount = 1) => new GameActionCost(GameActions.loseHonor(context => ({ target: context.player, amount }))),
    giveHonorToOpponent: (amount = 1) => new GameActionCost(GameActions.takeHonor(context => ({ target: context.player, amount }))),
    /**
     * Cost where a character must spend fate to an unclaimed ring
     */
    payFateToRing: (amount = 1, ringCondition = ring => ring.isUnclaimed()) => new MetaActionCost(GameActions.selectRing({
        ringCondition,
        gameAction: GameActions.placeFateOnRing(context => ({ amount, origin: context.player }))
    }), 'Select a ring to place fate on'),
    giveFateToOpponent: (amount = 1) => new GameActionCost(GameActions.takeFate(context => ({ target: context.player, amount }))),
    variableHonorCost: function (amount) {
        return {
            canPay: function (context) {
                return context.game.actions.loseHonor().canAffect(context.player, context);
            },
            resolve: function (context, result) {
                let max = Math.min(amount, context.player.honor);
                let choices = Array.from(Array(max), (x, i) => String(i + 1));
                if(result.canCancel) {
                    choices.push('Cancel');
                }
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose how much honor to pay',
                    context: context,
                    choices: choices,
                    choiceHandler: choice => {
                        if(choice === 'Cancel') {
                            context.costs.variableHonorCost = 0;
                            result.cancelled = true;
                        } else {
                            context.costs.variableHonorCost = parseInt(choice);
                        }
                    }
                });
            },
            payEvent: function (context) {
                let action = context.game.actions.loseHonor({ amount: context.costs.variableHonorCost });
                return action.getEvent(context.player, context);
            },
            promptsPlayer: true
        };
    },
    returnRings: function () {
        return {
            canPay: function (context) {
                return Object.values(context.game.rings).some(ring => ring.claimedBy === context.player.name);
            },
            resolve: function (context, result) {
                let chosenRings = [];
                let promptPlayer = () => {
                    let buttons = [];
                    if(chosenRings.length > 0) {
                        buttons.push({ text: 'Done', arg: 'done' });
                    }
                    if(result.canCancel) {
                        buttons.push({ text: 'Cancel', arg: 'cancel' });
                    }
                    context.game.promptForRingSelect(context.player, {
                        activePromptTitle: 'Choose a ring to return',
                        context: context,
                        buttons: buttons,
                        ringCondition: ring => ring.claimedBy === context.player.name && !chosenRings.includes(ring),
                        onSelect: (player, ring) => {
                            chosenRings.push(ring);
                            if(Object.values(context.game.rings).some(ring => ring.claimedBy === context.player.name && !chosenRings.includes(ring))) {
                                promptPlayer();
                            } else {
                                context.costs.returnRing = chosenRings;
                            }
                            return true;
                        },
                        onMenuCommand: (player, arg) => {
                            if(arg === 'done') {
                                context.costs.returnRing = chosenRings;
                                return true;
                            }
                        },
                        onCancel: () => {
                            context.costs.returnRing = [];
                            result.cancelled = true;
                        }
                    });
                };
                promptPlayer();
            },
            payEvent: context => context.game.actions.returnRing({ target: context.costs.returnRing }).getEventArray(context),
            promptsPlayer: true
        };
    },
    chooseFate: function (type) {
        return {
            canPay: function () {
                return true;
            },
            resolve: function (context, result) {
                let extrafate = context.player.fate - context.player.getReducedCost(type, context.source);
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
            pay: function (context) {
                context.player.fate -= context.chooseFate;
            },
            promptsPlayer: true
        };
    }
};

module.exports = Costs;
