const _ = require('underscore');
const { EventNames } = require('../Constants');

class Event {
    constructor(name, params, handler) {
        this.name = name;
        this.cancelled = false;
        this.resolved = false;
        this.handler = handler;
        this.context = null;
        this.window = null;
        this.replacementEvent = null;
        this.condition = (event) => true; // eslint-disable-line no-unused-vars
        this.order = 0;
        this.isContingent = false;
        this.checkFullyResolved = (event) => !event.cancelled;
        this.createContingentEvents = () => [];
        this.preResolutionEffect = () => true;
        _.extend(this, params);

        if(this.context && this.context.ability && !this.context.ability.doesNotTarget) {
            this.cardTargets = _.flatten(_.values(this.context.targets));
            this.ringTargets = _.flatten(_.values(this.context.rings));
            this.selectTargets = _.flatten(_.values(this.context.selects));
            this.tokenTargets = _.flatten(_.values(this.context.tokens));
        } else {
            this.cardTargets = [];
            this.ringTargets = [];
            this.selectTargets = [];
            this.tokenTargets = [];
        }
        this.allTargets = this.cardTargets.concat(this.ringTargets, this.selectTargets, this.tokenTargets);
    }

    cancel() {
        this.cancelled = true;
        if(this.window) {
            this.window.removeEvent(this);
        }
    }

    setWindow(window) {
        this.window = window;
    }

    unsetWindow() {
        this.window = null;
    }

    checkCondition() {
        if(this.cancelled || this.resolved || this.name === EventNames.Unnamed) {
            return;
        }
        if(!this.condition(this)) {
            this.cancel();
        }
    }

    getResolutionEvent() {
        if(this.replacementEvent) {
            return this.replacementEvent.getResolutionEvent();
        }
        return this;
    }

    isFullyResolved() {
        return this.checkFullyResolved(this.getResolutionEvent());
    }

    executeHandler() {
        this.resolved = true;
        if(this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler) {
        this.handler = newHandler;
    }
}

module.exports = Event;
