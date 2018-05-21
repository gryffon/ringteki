const _ = require('underscore');
const AbilityTargetAbility = require('./AbilityTargets/AbilityTargetAbility.js');
const AbilityTargetCard = require('./AbilityTargets/AbilityTargetCard.js');
const AbilityTargetRing = require('./AbilityTargets/AbilityTargetRing.js');
const AbilityTargetSelect = require('./AbilityTargets/AbilityTargetSelect.js');
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
     * @param {GameAction[]} [properties.gameAction] - optional array of game actions
     */
    constructor(properties) {
        this.gameAction = properties.gameAction || [];
        if(!Array.isArray(this.gameAction)) {
            this.gameAction = [this.gameAction];
        }
        this.cost = this.buildCost(properties.cost);
        this.targets = this.buildTargets(properties);
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
        if(properties.target) {
            return [this.getAbilityTarget('target', properties.target)];
        }

        if(properties.targets) {
            let targetPairs = Object.entries(properties.targets);
            return targetPairs.map(([name, properties]) => this.getAbilityTarget(name, properties));
        }

        return [];
    }
    
    getAbilityTarget(name, properties) {
        if(properties.gameAction) {
            if(!Array.isArray(properties.gameAction)) {
                properties.gameAction = [properties.gameAction];
            }
        } else {
            properties.gameAction = [];
        }
        if(properties.mode === 'select') {
            return new AbilityTargetSelect(name, properties);
        } else if(properties.mode === 'ring') {
            return new AbilityTargetRing(name, properties);
        } else if(properties.mode === 'ability') {
            return new AbilityTargetAbility(name, properties);
        }
        return new AbilityTargetCard(name, properties);
    }

    /**
     * @param {*} context
     * @returns {String} 
     */
    meetsRequirements(context) {
        if(this.targets.length === 0) {
            return this.canPayCosts(context) ? '' : 'cost';
        }
        return this.canResolveTargets(context) ? '' : (this.canPayCosts(context) ? 'target' : 'cost');
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context, targets = []) {
        if(!Array.isArray(targets)) {
            targets = [targets];
        }
        context.stage = 'costs';
        let canPay = this.cost.every(cost => cost.canPay(context, targets));
        context.stage = 'pretarget';
        return canPay;
    }

    /**
     * Resolves all costs for the ability prior to payment. Some cost objects
     * have a `resolve` method in order to prompt the user to make a choice,
     * such as choosing a card to kneel. Consumers of this method should wait
     * until all costs have a `resolved` value of `true` before proceeding.
     *
     * @returns {Array} An array of cost resolution results.
     */
    resolveCosts(context) {
        return this.cost.map(cost => {
            if(cost.resolve) {
                return cost.resolve(context);
            }

            return { resolved: true, value: cost.canPay(context) };
        });
    }

    /**
     * Pays all costs for the ability simultaneously.
     */
    payCosts(context) {
        return this.cost.reduce((array, cost) => {
            if(cost.payEvent) {
                return array.concat(cost.payEvent(context));
            } else if(cost.pay) {
                return array.concat(context.game.getEvent('payCost', {}, () => cost.pay(context)));
            }
            return array;
        }, []);
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return this.targets.every(target => {
            let dependsOn = target.properties.dependsOn;
            if(!dependsOn) {
                return target.canResolve(context);
            }
            let dependsOnTarget = this.targets.find(t => t.name === dependsOn);
            return dependsOnTarget.getAllLegalTargets(context).some(t => {
                if(dependsOnTarget.mode === 'select') {
                    context.selects[dependsOn] = t;
                    return target.canResolve(context);
                }
                if(dependsOnTarget.mode === 'ring') {
                    context.rings[dependsOn] = t;
                    return target.canResolve(context);
                }
                context.targets[dependsOn] = t;
                return target.canResolve(context);
            });
        });
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     *
     * @returns {Array} An array of target resolution objects.
     */
    resolveTargets(context, results = []) {
        if(results.length === 0) {
            let canIgnoreAllCosts = this.cost.every(cost => cost.canIgnoreForTargeting);
            return this.targets.map(target => target.resolve(context, canIgnoreAllCosts));
        }
        return _.zip(this.targets, results).map(array => {
            let [target, result] = array;
            if(!result.resolved || !target.checkTarget(context)) {
                return target.resolve(context);
            }
            return result;
        });
    }

    updateGameActions(context) {
        for(let target of this.targets) {
            target.updateGameActions(context);
        }
        for(let action of this.gameAction) {
            action.update(context);
        }
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
