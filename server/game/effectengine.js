const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');
const { EffectNames, Durations, EventNames } = require('./Constants');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register([EventNames.OnConflictFinished, EventNames.OnPhaseEnded, EventNames.OnRoundEnded, EventNames.OnDuelFinished]);
        this.effects = [];
        this.customDurationEvents = [];
        this.newEffect = false;
    }

    add(effect) {
        this.effects.push(effect);
        if(effect.duration === Durations.Custom) {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
        return effect;
    }

    checkDelayedEffects(events) {
        let effectsToTrigger = [];
        const effectsToRemove = [];
        for(const effect of this.effects.filter(effect => effect.effect.type === EffectNames.DelayedEffect)) {
            const properties = effect.effect.getValue();
            if(properties.condition) {
                if(properties.condition(effect.context)) {
                    effectsToTrigger.push(effect);
                }
            } else {
                const triggeringEvents = events.filter(event => properties.when[event.name]);
                if(triggeringEvents.length > 0) {
                    if(!properties.multipleTrigger && effect.duration !== Durations.Persistent) {
                        effectsToRemove.push(effect);
                    }
                    if(triggeringEvents.some(event => properties.when[event.name](event, effect.context))) {
                        effectsToTrigger.push(effect);
                    }
                }
            }
        }
        effectsToTrigger = effectsToTrigger.map(effect => {
            const properties = effect.effect.getValue();
            const context = effect.context;
            const targets = effect.targets;
            return {
                title: context.source.name + '\'s effect' + (targets.length === 1 ? ' on ' + targets[0].name : ''),
                handler: () => {
                    properties.gameAction.setDefaultTarget(() => targets);
                    if(properties.message && properties.gameAction.hasLegalTarget(context)) {
                        let messageArgs = properties.messageArgs || [];
                        if(typeof messageArgs === 'function') {
                            messageArgs = messageArgs(context);
                        }
                        this.game.addMessage(properties.message, ...messageArgs);
                    }
                    const actionEvents = [];
                    properties.gameAction.addEventsToArray(actionEvents, context);
                    this.game.queueSimpleStep(() => this.game.openThenEventWindow(actionEvents));
                    this.game.queueSimpleStep(() => context.refill());
                }
            };
        });
        if(effectsToRemove.length > 0) {
            this.unapplyAndRemove(effect => effectsToRemove.includes(effect));
        }
        if(effectsToTrigger.length > 0) {
            this.game.openSimultaneousEffectWindow(effectsToTrigger);
        }
    }

    removeLastingEffects(card) {
        this.unapplyAndRemove(effect =>
            effect.match === card && effect.duration !== Durations.Persistent && !effect.canChangeZoneOnce);
        for(const effect of this.effects) {
            if(effect.match === card && effect.canChangeZoneOnce) {
                effect.canChangeZoneOnce = false;
            }
        }
    }

    checkEffects(prevStateChanged = false, loops = 0) {
        if(!prevStateChanged && !this.newEffect) {
            return false;
        }
        let stateChanged = false;
        this.newEffect = false;
        // Check each effect's condition and find new targets
        stateChanged = this.effects.reduce((stateChanged, effect) => effect.checkCondition(stateChanged), stateChanged);
        if(loops === 10) {
            throw new Error('EffectEngine.checkEffects looped 10 times');
        } else {
            this.checkEffects(stateChanged, loops + 1);
        }
        return stateChanged;
    }

    onConflictFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === Durations.UntilEndOfConflict);
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === Durations.UntilEndOfDuel);
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === Durations.UntilEndOfPhase);
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === Durations.UntilEndOfRound);
    }

    registerCustomDurationEvents(effect) {
        if(!effect.until) {
            return;
        }

        let eventNames = Object.keys(effect.until);
        let handler = this.createCustomDurationHandler(effect);
        _.each(eventNames, eventName => {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        });
    }

    unregisterCustomDurationEvents(effect) {
        let eventsForEffect = this.customDurationEvents.filter(event => event.effect === effect);

        _.each(eventsForEffect, event => {
            this.game.removeListener(event.name, event.handler);
        });

        this.customDurationEvents = this.customDurationEvents.filter(event => event.effect !== effect);
    }

    createCustomDurationHandler(customDurationEffect) {
        return (...args) => {
            let event = args[0];
            let listener = customDurationEffect.until[event.name];
            if(listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = this.effects.filter(effect => effect !== customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        let matchingEffects = this.effects.filter(match);
        _.each(matchingEffects, effect => {
            effect.cancel();
            if(effect.duration === Durations.Custom) {
                this.unregisterCustomDurationEvents(effect);
            }
        });
        this.effects = this.effects.filter(effect => !matchingEffects.includes(effect));
        return matchingEffects.length > 0;
    }

    getDebugInfo() {
        return this.effects.map(effect => effect.getDebugInfo());
    }
}

module.exports = EffectEngine;
