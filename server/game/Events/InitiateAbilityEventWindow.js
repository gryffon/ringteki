const _ = require('underscore');
const EventWindow = require('./EventWindow.js');
const TriggeredAbilityWindow = require('../gamesteps/triggeredabilitywindow');
const { EventNames, AbilityTypes } = require('../Constants');

class InitiateAbilityInterruptWindow extends TriggeredAbilityWindow {
    constructor(game, abilityType, eventWindow) {
        super(game, abilityType, eventWindow);
        this.playEvent = eventWindow.events.find(event => event.name === EventNames.OnCardPlayed);
    }

    getPromptForSelectProperties() {
        let buttons = [];
        if(this.playEvent && this.currentPlayer === this.playEvent.player && this.playEvent.resolver.canCancel) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        if(this.getMinCostReduction() === 0) {
            buttons.push({ text: 'Pass', arg: 'pass' });
        }
        return Object.assign(super.getPromptForSelectProperties(), {
            buttons: buttons,
            onCancel: () => {
                this.playEvent.resolver.cancelled = true;
                this.complete = true;
            }
        });
    }

    getMinCostReduction() {
        if(this.playEvent) {
            const context = this.playEvent.context;
            const alternatePools = context.player.getAlternateFatePools(this.playEvent.playType, context.source, context);
            const alternatePoolTotal = alternatePools.reduce((total, pool) => total + pool.fate, 0);
            const maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
            return Math.max(context.ability.getReducedCost(context) - maxPlayerFate - alternatePoolTotal, 0);
        }
        return 0;
    }

    resolveAbility(context) {
        if(this.playEvent) {
            this.playEvent.resolver.canCancel = false;
        }
        return super.resolveAbility(context);
    }
}

class InitiateAbilityEventWindow extends EventWindow {
    openWindow(abilityType) {
        if(this.events.length && abilityType === AbilityTypes.Interrupt) {
            this.queueStep(new InitiateAbilityInterruptWindow(this.game, abilityType, this));
        } else {
            super.openWindow(abilityType);
        }
    }

    executeHandler() {
        this.events = _.sortBy(this.events, 'order');

        _.each(this.events, event => {
            event.checkCondition();
            if(!event.cancelled) {
                event.executeHandler();
            }
        });

        // We need to separate executing the handler and emitting events as in this window, the handler just
        // queues ability resolution steps, and we don't want the events to be emitted until step 8
        this.game.queueSimpleStep(() => this.emitEvents());
    }

    emitEvents() {
        _.each(this.events, event => this.game.emit(event.name, event));
    }
}

module.exports = InitiateAbilityEventWindow;
