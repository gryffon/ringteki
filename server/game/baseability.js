const AbilityTargetAbility = require('./AbilityTargets/AbilityTargetAbility.js');
const AbilityTargetCard = require('./AbilityTargets/AbilityTargetCard.js');
const AbilityTargetRing = require('./AbilityTargets/AbilityTargetRing.js');
const AbilityTargetSelect = require('./AbilityTargets/AbilityTargetSelect.js');
const AbilityTargetToken = require('./AbilityTargets/AbilityTargetToken.js');
const { Stages, TargetModes } = require('./Constants.js');

/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
class BaseAbility {
    /**
     * Creates an ability.
     *
     * @param {Object} properties - An object with ability related properties.
     * @param {Object|Array} [properties.cost] - optional property that specifies
     * the cost for the ability. Can either be a cost object or an array of cost
     * objects.
     * @param {Object} [properties.target] - optional property that specifies
     * the target of the ability.
     * @param [properties.gameAction] - GameAction[] optional array of game actions
     */
    constructor(properties) {
        this.gameAction = properties.gameAction || [];
        if(!Array.isArray(this.gameAction)) {
            this.gameAction = [this.gameAction];
        }
        this.buildTargets(properties);
        this.cost = this.buildCost(properties.cost);
        for(const cost of this.cost) {
            if(cost.dependsOn) {
                let dependsOnTarget = this.targets.find(target => target.name === cost.dependsOn);
                dependsOnTarget.dependentCost = cost;
            }
        }
        this.nonDependentTargets = this.targets.filter(target => !target.properties.dependsOn);
    }

    buildCost(cost) {
        if(!cost) {
            return [];
        }

        if(!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        this.targets = [];
        if(properties.target) {
            this.targets.push(this.getAbilityTarget('target', properties.target));
        } else if(properties.targets) {
            for(const key of Object.keys(properties.targets)) {
                this.targets.push(this.getAbilityTarget(key, properties.targets[key]));
            }
        }
    }

    getAbilityTarget(name, properties) {
        if(properties.gameAction) {
            if(!Array.isArray(properties.gameAction)) {
                properties.gameAction = [properties.gameAction];
            }
        } else {
            properties.gameAction = [];
        }
        if(properties.mode === TargetModes.Select) {
            return new AbilityTargetSelect(name, properties, this);
        } else if(properties.mode === TargetModes.Ring) {
            return new AbilityTargetRing(name, properties, this);
        } else if(properties.mode === TargetModes.Ability) {
            return new AbilityTargetAbility(name, properties, this);
        } else if(properties.mode === TargetModes.Token) {
            return new AbilityTargetToken(name, properties, this);
        }
        return new AbilityTargetCard(name, properties, this);
    }

    /**
     * @param {*} context
     * @returns {String}
     */
    meetsRequirements(context) {
        // check legal targets exist
        // check costs can be paid
        // check for potential to change game state
        if(!this.canPayCosts(context)) {
            return 'cost';
        }
        if(this.targets.length === 0) {
            if(this.gameAction.length > 0 && !this.checkGameActionsForPotential(context)) {
                return 'condition';
            }
            return '';
        }
        return this.canResolveTargets(context) ? '' : 'target';
    }

    checkGameActionsForPotential(context) {
        return this.gameAction.some(gameAction => gameAction.hasLegalTarget(context));
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context) {
        let contextCopy = context.copy({ stage: Stages.Cost });
        return this.getCosts(context).every(cost => cost.canPay(contextCopy));
    }

    getCosts(context) { // eslint-disable-line no-unused-vars
        return this.cost;
    }

    resolveCosts(events, context, results) {
        for(let cost of this.getCosts(context)) {
            context.game.queueSimpleStep(() => {
                if(!results.cancelled) {
                    if(cost.addEventsToArray) {
                        cost.addEventsToArray(events, context, results);
                    } else {
                        if(cost.resolve) {
                            cost.resolve(context, results);
                        }
                        context.game.queueSimpleStep(() => {
                            if(!results.cancelled) {
                                let newEvents = cost.payEvent ? cost.payEvent(context) : context.game.getEvent('payCost', {}, () => cost.pay(context));
                                if(Array.isArray(newEvents)) {
                                    for(let event of newEvents) {
                                        events.push(event);
                                    }
                                } else {
                                    events.push(newEvents);
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return this.nonDependentTargets.every(target => target.canResolve(context));
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     */
    resolveTargets(context) {
        let targetResults = {
            canIgnoreAllCosts: context.stage === Stages.PreTarget ? this.cost.every(cost => cost.canIgnoreForTargeting) : false,
            cancelled: false,
            payCostsFirst: false,
            delayTargeting: null
        };
        for(let target of this.targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    resolveRemainingTargets(context, nextTarget) {
        const index = this.targets.indexOf(nextTarget);
        let targets = this.targets.slice();
        if(targets.slice(0, index).every(target => target.checkTarget(context))) {
            targets = targets.slice(index);
        }
        let targetResults = {};
        for(const target of targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    hasLegalTargets(context) {
        return this.nonDependentTargets.every(target => target.hasLegalTarget(context));
    }

    checkAllTargets(context) {
        return this.nonDependentTargets.every(target => target.checkTarget(context));
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        return this.targets.some(target => target.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.gameAction.some(action => action.hasTargetsChosenByInitiatingPlayer(context)) ||
            this.cost.some(cost => cost.hasTargetsChosenByInitiatingPlayer && cost.hasTargetsChosenByInitiatingPlayer(context));
    }

    displayMessage(context) { // eslint-disable-line no-unused-vars
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) { // eslint-disable-line no-unused-vars
    }

    isAction() {
        return false;
    }

    isCardPlayed() {
        return false;
    }

    isCardAbility() {
        return false;
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = BaseAbility;
