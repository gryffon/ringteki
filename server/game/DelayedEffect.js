const _ = require('underscore');

const Effects = require('./effects.js');
const Player = require('./player.js');

/**
 * Represents a delayed card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * targetType       - string that determines whether cards or players are the
 *                    target for the effect. Can be 'card' (default) or 'player'
 * gameAction       - gameAction to apply to target
 * effectFunc       - a function
 * trigger
 */

class DelayedEffect {
    constructor(game, context, properties) {
        this.game = game;
        this.context = context;
        this.match = properties.match || (() => true);
        this.condition = properties.condition || (() => true);
        this.targetController = properties.targetController || 'current';
        this.targetType = properties.targetType || 'card';
        this.gameAction = properties.gameAction;
        this.effectFunc = properties.effectFunc;
        this.trigger = properties.trigger || [];
        if(!_.isArray(this.trigger)) {
            this.trigger = [this.trigger];
        }
    }

    getTargets() {
        if(!this.active || !this.condition()) {
            return;
        }

        if(!_.isFunction(this.match)) {
            this.addTargets([this.match]);
        } else if(this.targetType === 'player') {
            this.addTargets(_.values(this.game.getPlayers()));
        } else {
            this.addTargets(this.game.getTargetsForEffect(this.match));
        }
    }

    addTargets(targets) {
        if(!this.active || !this.condition()) {
            return;
        }

        let newTargets = _.difference(targets, this.targets);

        _.each(newTargets, target => {
            if(this.isValidTarget(target)) {
                this.targets.push(target);
                this.effect.apply(target, this.context);
            }
        });
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

    reapply() {
        if(!this.active) {
            return;
        }

        if(this.isConditional) {
            let newCondition = this.condition();

            if(!newCondition) {
                this.cancel();
                return;
            }

            if(newCondition) {
                let invalidTargets = _.filter(this.targets, target => !this.isValidTarget(target));
                _.each(invalidTargets, target => {
                    this.removeTarget(target);
                });
                this.getTargets();
            }
        }

        if(this.effect.isStateDependent) {
            let reapplyFunc = this.createReapplyFunc();
            _.each(this.targets, target => reapplyFunc(target));
        }
    }

    createReapplyFunc() {
        if(this.effect.reapply) {
            return target => this.effect.reapply(target, this.context);
        }

        return target => {
            this.effect.unapply(target, this.context);
            this.effect.apply(target, this.context);
        };
    }
}

module.exports = DelayedEffect;
