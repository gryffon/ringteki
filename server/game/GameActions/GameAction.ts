import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event.js');
import { CardTypes, EventNames } from '../Constants';

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
    eventName = EventNames.Unnamed;
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

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return [this.effect, [target]];
    }

    setDefaultTarget(func: (context: AbilityContext) => any): void {
        this.getDefaultTargets = func;
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        return this.targetType.includes(target.type) && target.checkRestrictions(this.name, context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.target as PlayerOrRingOrCard[]).some(target => this.canAffect(target, context, additionalProperties));
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const target of (properties.target as PlayerOrRingOrCard[]).filter(target => this.canAffect(target, context, additionalProperties))) {
            events.push(this.getEvent(target, context, additionalProperties));
        }
    }

    getEvent(target: any, context: AbilityContext, additionalProperties = {}): Event {
        let event = this.createEvent(target, context, additionalProperties);
        this.updateEvent(event, target, context, additionalProperties);
        return event;
    }

    updateEvent(event: Event, target: any, context: AbilityContext, additionalProperties = {}): void {
        event.name = this.eventName;
        this.addPropertiesToEvent(event, target, context, additionalProperties);
        event.replaceHandler(event => this.eventHandler(event, additionalProperties));
        event.condition = () => this.checkEventCondition(event, additionalProperties);
    }

    createEvent(target: any, context: AbilityContext, additionalProperties): Event {
        let event = new Event(EventNames.Unnamed, {});
        event.checkFullyResolved = eventAtResolution => this.isEventFullyResolved(eventAtResolution, target, context, additionalProperties);
        return event;
    }

    resolve(target: PlayerOrRingOrCard, context: AbilityContext): void {
        this.setDefaultTarget(() => target);
        let events = [];
        this.addEventsToArray(events, context);
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getEventArray(context: AbilityContext, additionalProperties = {}): Event[] {
        let events = [];
        this.addEventsToArray(events, context, additionalProperties);
        return events;
    }

    addPropertiesToEvent(event: any, target: any, context: AbilityContext, additionalProperties = {}): void { // eslint-disable-line no-unused-vars
        event.context = context;
    }

    eventHandler(event: any, additionalProperties = {}): void { // eslint-disable-line no-unused-vars
    }
    
    checkEventCondition(event: Event, additionalProperties = {}): boolean { // eslint-disable-line no-unused-vars
        return true;
    }

    isEventFullyResolved(event: Event, target: any, context: AbilityContext, additionalProperties = {}): boolean { // eslint-disable-line no-unused-vars
        return !event.cancelled && event.name === this.eventName;
    }

    moveFateEventCondition(event): boolean {
        if(event.origin) {
            if(event.origin.fate === 0) {
                return false;
            } else if(event.origin.type === CardTypes.Character && !event.origin.allowGameAction('removeFate', event.context)) {
                return false;
            }
        }
        if(event.recipient) {
            if(event.recipient.type === CardTypes.Character && !event.recipient.allowGameAction('placeFate', event.context)) {
                return false;
            } 
        }
        return (!!event.origin || !!event.recipient);
    }

    moveFateEventHandler(event): void {
        if(event.origin) {
            event.fate = Math.min(event.fate, event.origin.fate);
            event.origin.modifyFate(-event.fate);
        }
        if(event.recipient) {
            event.recipient.modifyFate(event.fate);
        }
    }
}
