import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event.js');
import EventWindow = require('../Events/EventWindow');
import GameObject = require('../GameObject');
import { EventNames } from '../Constants';

import BaseCard = require('../basecard');
import Ring = require ('../ring');
import Player = require('../player');

type PlayerOrRingOrCard = Player | Ring | BaseCard;

export interface GameActionProperties {
    target?: PlayerOrRingOrCard | PlayerOrRingOrCard[];
}

export class GameAction {
    propertyFactory: (context?: AbilityContext) => GameActionProperties;
    properties: GameActionProperties;
    targetType: string[] = [];
    name = '';
    cost = '';
    effect = '';
    defaultProperties: GameActionProperties = {};
    getDefaultTargets: (context: AbilityContext) => any = context => this.defaultTargets(context);

    constructor(propertyFactory: GameActionProperties | ((context?: AbilityContext) => GameActionProperties) = {}) {
        if(typeof propertyFactory === 'function') {
            this.propertyFactory = <(context?: AbilityContext) => GameActionProperties>propertyFactory;
        } else {
            this.properties = propertyFactory;
        }
    }

    defaultTargets(context: AbilityContext): any[] { // eslint-disable-line no-unused-vars
        return [];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): GameActionProperties {
        let properties = Object.assign({ target: this.getDefaultTargets(context) }, this.defaultProperties, this.properties || this.propertyFactory(context), additionalProperties);
        if(!Array.isArray(properties.target)) {
            properties.target = [properties.target];
        }
        return properties;
    }

    getCostMessage(context: AbilityContext): [string, any[]] { // eslint-disable-line no-unused-vars
        return [this.cost, []];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] { // eslint-disable-line no-unused-vars
        return [this.effect, []];
    }

    setDefaultTarget(func: (context: AbilityContext) => any): void {
        this.getDefaultTargets = func;
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        return this.targetType.includes(target.type) && target.checkRestrictions(this.name, context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.target as PlayerOrRingOrCard[]).some(target => this.canAffect(target, context));
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const target of (properties.target as PlayerOrRingOrCard[]).filter(target => this.canAffect(target, context))) {
            events.push(this.getEvent(target, context, additionalProperties));
        }
    }

    getEvent(target: any, context: AbilityContext, additionalProperties = {}): Event {
        return this.createEvent(EventNames.Unnamed, { context }, () => true);
    }

    createEvent(name: EventNames, params: object, handler: (event: any) => void): Event {
        let event = new Event(name, params, handler, this);
        return event;
    }

    resolve(target: PlayerOrRingOrCard, context: AbilityContext): void {
        this.setDefaultTarget(() => target);
        let events = [];
        this.addEventsToArray(events, context);
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getEventArray(context, additionalProperties = {}) {
        let events = [];
        this.addEventsToArray(events, context, additionalProperties);
        return events;
    }
    
    checkEventCondition(event: Event): boolean { // eslint-disable-line no-unused-vars
        return true;
    }

    fullyResolved(event: Event): boolean { // eslint-disable-line no-unused-vars
        return true;
    }
}
