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
        this.terminalConditions = this.terminalConditions.filter(e => e !== effect);
    }

    addDelayedEffect(effect) {
        this.delayedEffects.push(effect);
    }

    removeDelayedEffect(effect) {
        this.delayedEffects = this.delayedEffects.filter(e => e !== effect);
    }

    checkDelayedEffects(events) {
        let effectsToTrigger = this.delayedEffects.filter(effect => effect.checkEffect(events));
        if(effectsToTrigger.length > 0) {
            this.game.openSimultaneousEffectWindow(effectsToTrigger.map(effect => ({
                title: effect.source.name + '\'s effect on ' + effect.target.name,
                handler: () => effect.executeHandler()
            })));
        }
    }

    checkTerminalConditions() {
        let effectsToTrigger = this.terminalConditions.filter(effect => effect.condition());
        if(effectsToTrigger.length > 0) {
            this.game.openThenEventWindow(effectsToTrigger.reduce((array, effect) => array.concat(effect.getEvents()), []));
        }
    }

    checkEffects(stateChanged = false, loops = 0) {
        if(!stateChanged && !this.newEffect) {
            return false;
        }
        stateChanged = false;
        this.newEffect = false;
        for(const effect of this.effects) {
            // Check each effect's condition and find new targets
            stateChanged = effect.checkCondition(stateChanged);
        }
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
        this.delayedEffects = this.delayedEffects.filter(effect => effect.target !== event.card);
        this.terminalConditions = this.terminalConditions.filter(effect => effect.target !== event.card);
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
            if(effect.duration === 'custom') {
                this.unregisterCustomDurationEvents(effect);
            }
        });
        this.effects = this.effects.filter(effect => !matchingEffects.includes(effect));
        return matchingEffects.length > 0;
    }

    getDebugInfo() {
        return {
            effects: this.effects.map(effect => effect.getDebugInfo()),
            delayedEffects: this.delayedEffects.map(effect => effect.getDebugInfo())
        };
    }
}

module.exports = EffectEngine;
