const Event = require('../Events/Event.js');

class GameAction {
    constructor(name) {
        this.name = name;
        this.targets = [];
        this.targetType = [];
        this.optionsFunc = () => ({});
        this.targetFunc = this.getDefaultTargets;
        this.effect = '';
        this.cost = '';
    }

    initialise(context) {
        this.setOptions(this.optionsFunc(context));
        this.setTarget(this.targetFunc(context), context);
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
        if(typeof targetFunc === 'function') {
            this.targetFunc = targetFunc;
        } else if(!Array.isArray(targetFunc)) {
            this.targets = [targetFunc];
            this.targetFunc = () => [targetFunc];
        } else {
            this.targets = targetFunc;
            this.targetFunc = () => targetFunc;
        }
        return this;
    }

    setTarget(targets, context) {
        if(!targets) {
            return false;
        }
        if(!Array.isArray(targets)) {
            targets = [targets];
        }
        this.setOptions(this.optionsFunc(context));
        this.targets = targets.filter(target => this.canAffect(target, context));
        return this.targets.length > 0;
    }

    hasLegalTarget(context) {
        this.targets = this.targets.filter(target => this.canAffect(target, context));
        return this.targets.length > 0;
    }

    preEventHandler(context) { // eslint-disable-line no-unused-vars
    }

    resolve(targets, context) {
        this.setTarget(targets, context);
        this.preEventHandler(context);
        return context.game.openEventWindow(this.getEventArray(context));
    }

    canAffect(target, context) {
        return this.targetType.includes(target.type) && target.checkRestrictions(this.name, context);
    }

    checkEventCondition(event) { // eslint-disable-line no-unused-vars
        return true;
    }

    getDefaultTargets(context) { // eslint-disable-line no-unused-vars
        return null;
    }

    getEvent(target, context) { // eslint-disable-line no-unused-vars
        throw new Error('GameAction.getEvent called');
    }

    getEventArray(context) {
        return this.targets.filter(target => this.canAffect(target, context)).map(target => this.getEvent(target, context));
    }

    createEvent(name, optionsFunc, handler) {
        let event = new Event(name, optionsFunc, handler, this);
        return event;
    }
}

module.exports = GameAction;
