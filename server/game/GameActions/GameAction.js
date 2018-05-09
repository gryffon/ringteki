const Event = require('../Events/Event.js');

class GameAction {
    constructor(name) {
        this.name = name;
        this.targets = [];
        this.targetType = [];
        this.optionsFunc = () => {};
        this.effect = '';
        this.cost = '';
    }

    options(optionsFunc) {
        if(typeof optionsFunc === 'function') {
            this.optionsFunc = optionsFunc;
        } else {
            this.setOptions(optionsFunc);
        }
        return this;
    }

    setOptions(properties) {
        for(let [key, value] of Object.entries(properties)) {
            this[key] = value;
        }
    }

    target(targetFunc) {
        this.targetFunc = targetFunc;
        return this;
    }

    setTarget(targets, context) {
        if(context) {
            this.context = context;
        }
        if(!targets) {
            return false;
        }
        if(!Array.isArray(targets)) {
            targets = [targets];
        }
        this.setOptions(this.optionsFunc(context));
        this.targets = targets.filter(target => this.canAffect(target));
        return this.targets.length > 0;
    }

    hasLegalTarget(context) {
        return this.setTarget(this.targetFunc(context), context);
    }

    preEventHandler(context) { // eslint-disable-line no-unused-vars
    }

    resolve(targets, context) {
        this.setTarget(targets, context);
        this.preEventHandler(context);
        return context.game.openEventWindow(this.getEventArray());
    }

    canAffect(target, context = this.context) {
        return this.targetType.includes(target.type) && target.checkRestrictions(this.name, context);
    }

    checkEventCondition(event) { // eslint-disable-line no-unused-vars
        return true;
    }

    getDefaultTargets(context) { // eslint-disable-line no-unused-vars
        return null;
    }

    getEvent(target, context = this.context) {
        return this.createEvent('unnamedEvent', { target: target, context: context });
    }

    getEventArray() {
        return this.targets.filter(target => this.canAffect(target)).map(target => this.getEvent(target));
    }

    createEvent(name, optionsFunc, handler) {
        let event = new Event(name, optionsFunc, handler, this);
        event.context = this.context;
        return event;
    }
}

module.exports = GameAction;
