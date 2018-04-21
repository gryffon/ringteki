const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardMoved', 'onConflictFinished', 'onPhaseEnded', 'onRoundEnded', 'onDuelFinished']);
        this.effects = [];
        this.delayedEffects = [];
        this.terminalConditions = [];
        this.customDurationEvents = [];
        this.newEffect = false;
    }

    add(effect) {
        this.effects.push(effect);
        if(effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
    }

    addTerminalCondition(effect) {
        this.terminalConditions.push(effect);
    }

    removeTerminalCondition(effect) {
        this.terminalConditions = _.reject(this.terminalConditions, e => e === effect);
    }

    addDelayedEffect(effect) {
        this.delayedEffects.push(effect);
    }

    removeDelayedEffect(effect) {
        this.delayedEffects = _.reject(this.delayedEffects, e => e === effect);
    }

    checkDelayedEffects(events) {
        let effectsToTrigger = _.filter(this.delayedEffects, effect => effect.checkEffect(events));
        if(effectsToTrigger.length > 0) {
            this.game.openSimultaneousEffectWindow(_.map(effectsToTrigger, effect => ({
                title: effect.source.name + '\'s effect on ' + effect.target.name,
                handler: () => effect.executeHandler()
            })));
        }
    }

    checkTerminalConditions() {
        let effectsToTrigger = _.filter(this.terminalConditions, effect => effect.condition());
        if(effectsToTrigger.length > 0) {
            this.game.openThenEventWindow(_.flatten(_.map(effectsToTrigger, effect => effect.getEvents())));
        }
    }

    checkEffects(stateChanged = false, loops = 0) {
        if(!stateChanged && !this.newEffect) {
            return false;
        }
        stateChanged = false;
        this.newEffect = false;
        _.each(this.effects, effect => {
            // Check each effect's condition and find new targets
            stateChanged = effect.checkCondition(stateChanged);
        });
        if(loops === 10) {
            throw new Error('EffectEngine.checkEffects looped 10 times');
        } else {
            this.checkEffects(stateChanged, loops + 1);
        }
        return stateChanged;
    }

    onCardMoved(event) {
        // remove any effects which this card is emmiting which it shouldn't be
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged));
        // Any lasting or delayed effects on this card should be removed when it leaves play
        this.unapplyAndRemove(effect => effect.match === event.card && effect.targetLocation !== 'any' && effect.duration !== 'persistent');
        this.delayedEffects = _.reject(this.delayedEffects, effect => effect.target === event.card);
        this.terminalConditions = _.reject(this.terminalConditions, effect => effect.target === event.card);
    }

    onConflictFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfConflict');
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfDuel');
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfPhase');
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfRound');
    }

    registerCustomDurationEvents(effect) {
        if(!effect.until) {
            return;
        }

        let eventNames = _.keys(effect.until);
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
        let [eventsForEffect, remainingEvents] = _.partition(this.customDurationEvents, event => event.effect === effect);

        _.each(eventsForEffect, event => {
            this.game.removeListener(event.name, event.handler);
        });

        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(customDurationEffect) {
        return (...args) => {
            let event = args[0];
            let listener = customDurationEffect.until[event.name];
            if(listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = _.reject(this.effects, effect => effect === customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
            if(effect.duration === 'custom') {
                this.unregisterCustomDurationEvents(effect);
            }
        });
        this.effects = remainingEffects;
        return matchingEffects.length > 0;
    }

    getDebugInfo() {
        return {
            effects: _.map(this.effects, effect => effect.getDebugInfo()),
            delayedEffects: _.map(this.delayedEffects, effect => effect.getDebugInfo())
        };
    }
}

module.exports = EffectEngine;
