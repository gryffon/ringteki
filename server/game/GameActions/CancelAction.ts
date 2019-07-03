import { GameAction, GameActionProperties } from './GameAction';
import TriggeredAbilityContext = require('../TriggeredAbilityContext');

export interface CancelActionProperties extends GameActionProperties {
    replacementGameAction?: GameAction;
}

export class CancelAction extends GameAction {
    getEffectMessage(context: TriggeredAbilityContext): [string, any[]] {
        let { replacementGameAction } = this.getProperties(context);
        if(replacementGameAction) {
            return ['{1} {0} instead of {2}', [context.target, replacementGameAction.name, context.event.card]]
        }
        return ['cancel the effects of {0}', [context.event.card]];
    }

    getProperties(context: TriggeredAbilityContext, additionalProperties = {}): CancelActionProperties {
        let properties = super.getProperties(context, additionalProperties) as CancelActionProperties;
        if(properties.replacementGameAction) {
            properties.replacementGameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        if(!context.event || context.event.cancelled) {
            return false;
        }
        let { replacementGameAction } = this.getProperties(context);
        return !context.event.cannotBeCancelled &&
            (!replacementGameAction || replacementGameAction.hasLegalTarget(context, additionalProperties));
    }

    addEventsToArray(events: any[], context: TriggeredAbilityContext, additionalProperties = {}): void {
        let event = this.createEvent(null, context, additionalProperties);
        super.addPropertiesToEvent(event, null, context, additionalProperties);
        event.replaceHandler(event => this.eventHandler(event, additionalProperties));
        events.push(event);
    }

    eventHandler(event, additionalProperties = {}): void {
        let { replacementGameAction } = this.getProperties(event.context, additionalProperties);
        if(replacementGameAction) {
            let events = []
            let eventWindow = event.context.event.window;
            replacementGameAction.addEventsToArray(events, event.context, Object.assign({ replacementEffect: true }, additionalProperties));
            event.context.game.queueSimpleStep(() => {
                if(!event.context.event.isSacrifice && events.length === 1) {
                    event.context.event.replacementEvent = events[0];
                }
                for(let newEvent of events) {
                    eventWindow.addEvent(newEvent);
                }
            });
        }
        event.context.cancel();
    }

    canAffect(target: any, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context, additionalProperties);
        return !context.event.cannotBeCancelled &&
            !replacementGameAction || replacementGameAction.canAffect(target, context, additionalProperties);
    }

    defaultTargets(context: TriggeredAbilityContext): any[] {
        return context.event.card ? [context.event.card] : [];
    }

    hasTargetsChosenByInitiatingPlayer(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context);
        return replacementGameAction && replacementGameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
