const _ = require('underscore');

const Effects = require('./effects.js');
const Player = require('./player.js');

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * targetType       - string that determines whether cards or players are the
 *                    target for the effect. Can be 'card' (default) or 'player'
 * targetLocation   - string that determines the location of cards that can be
 *                    applied by the effect. Can be 'play area' (default) or
 *                    'hand'.
 * effect           - object representing the effect to be applied. If passed an
 *                    array instead of an object, it will apply / unapply all of
 *                    the sub objects in the array instead.
 * effect.apply     - function that takes a card and a context object and modifies
 *                    the card to apply the effect.
 * effect.unapply   - function that takes a card and a context object and modifies
 *                    the card to remove the previously applied effect.
 * recalculateWhen  - optional array of event names that indicate when an effect
 *                    should be recalculated by the engine.
 */
class Effect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.until = properties.until || {};
        this.condition = properties.condition || (() => true);
        this.location = properties.location || 'play area';
        this.targetController = properties.targetController || 'current';
        this.targetType = properties.targetType || 'card';
        this.targetLocation = properties.targetLocation || 'play area';
        this.effect = this.buildEffect(properties.effect);
        this.targets = [];
        this.context = { game: game, source: source };
        this.active = true;
        this.recalculateWhen = properties.recalculateWhen || [];
        this.isConditional = !!properties.condition;
    }

    buildEffect(effect) {
        if(_.isArray(effect)) {
            return Effects.all(effect);
        }

        return effect;
    }

    isInActiveLocation() {
        return ['any', this.source.location].includes(this.location);
    }

    getTargets() {
        if(!this.active || !this.condition()) {
            return false;
        }

        if(!_.isFunction(this.match)) {
            return this.addTargets([this.match]);
        } else if(this.targetType === 'player') {
            return this.addTargets(_.values(this.game.getPlayers()));
        }
        return this.addTargets(this.game.getTargetsForEffect(this.match));
    }

    addTargets(targets) {
        let stateChanged = false;
        if(!this.active || !this.condition()) {
            return stateChanged;
        }

        let newTargets = _.difference(targets, this.targets);

        _.each(newTargets, target => {
            if(this.isValidTarget(target)) {
                this.targets.push(target);
                this.effect.apply(target, this.context);
                stateChanged = true;
            }
        });
        return stateChanged;
    }

    isValidTarget(target) {
        if(this.targetType === 'card') {
            if(this.targetLocation === 'play area' && target.location !== 'play area') {
                return false;
            }

            if(this.targetLocation === 'hand' && target.location !== 'hand') {
                return false;
            }

            if(this.targetLocation === 'province' && !['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(target.location)) {
                return false;
            }

            if(!(target instanceof Player) && !target.allowEffectFrom(this.source)) {
                return false;
            }
        }

        if(!_.isFunction(this.match)) {
            return target === this.match;
        }

        if((this.targetType === 'card' && (target instanceof Player)) || (this.targetType === 'player' && !(target instanceof Player))) {
            return false;
        }

        if(!this.match(target, this.context)) {
            return false;
        }

        if(this.targetType === 'card') {
            if(this.targetController === 'current') {
                return target.controller === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target.controller !== this.source.controller;
            }
        } else if(this.targetType === 'player') {
            if(this.targetController === 'current') {
                return target === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target !== this.source.controller;
            }
        }

        return true;
    }

    removeTarget(card) {
        if(!_.contains(this.targets, card)) {
            return;
        }

        this.effect.unapply(card, this.context);

        this.targets = _.reject(this.targets, target => target === card);
    }

    hasTarget(card) {
        return this.targets.includes(card);
    }

    setActive(newActive) {
        let oldActive = this.active;

        this.active = newActive;

        if(oldActive && !newActive) {
            this.cancel();
        }

        if(!oldActive && newActive) {
            this.getTargets();
        }
    }

    cancel() {
        _.each(this.targets, target => this.effect.unapply(target, this.context));
        this.targets = [];
    }

    checkCondition(stateChanged) {
        if(!this.active) {
            return stateChanged;
        }
        if(!this.condition()) {
            stateChanged = this.targets.length > 0;
            this.cancel();
        } else {
            let invalidTargets = _.filter(this.targets, target => !this.isValidTarget(target));
            stateChanged = invalidTargets.length > 0;
            _.each(invalidTargets, target => {
                this.removeTarget(target);
            });
            stateChanged = this.getTargets() || stateChanged;
        }
        return stateChanged;
    }

    reapply(stateChanged) {
        if(this.active && this.effect.reapply) {
            _.each(this.targets, target => stateChanged = this.effect.reapply(target, this.context) || stateChanged);
        }
        return stateChanged;
    }

    unapplyThenApply() {
        _.each(this.targets, target => {
            this.effect.unapply(target, this.context);
            this.effect.apply(target, this.context);
        });
    }

    getDebugInfo() {
        return {
            source: this.source.name,
            targets: _.map(this.targets, target => target.name),
            active: this.active,
            condition: this.condition()
        };
    }
}

module.exports = Effect;
