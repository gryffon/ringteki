import { GameAction, GameActionProperties } from './GameAction';
import TriggeredAbilityContext = require('../TriggeredAbilityContext');

export interface CancelActionProperties extends GameActionProperties {
    replacementGameAction?: GameAction;
    thenGameAction?: GameAction;
}

export class CancelAction extends GameAction {
    getEffectMessage(context: TriggeredAbilityContext): [string, any[]] {
        let { replacementGameAction } = this.getProperties(context);
        if(replacementGameAction) {
            return ['{1} {0} instead of {2}', [replacementGameAction.name, context.event.card]]
        }
        return ['cancel the effects of {1}', [context.event.card]];
    }

    getProperties(context: TriggeredAbilityContext, additionalProperties = {}): CancelActionProperties {
        let properties = super.getProperties(context, additionalProperties) as CancelActionProperties;
        if(properties.replacementGameAction) {
            properties.replacementGameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context);
        return !replacementGameAction || replacementGameAction.hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: any[], context: TriggeredAbilityContext, additionalProperties = {}): void {
        let event = this.createEvent(null, context, additionalProperties);
        event.context = context;
        event.replaceHandler(event => this.eventHandler(event, additionalProperties));
        events.push(event);   
    }

    eventHandler(event, additionalProperties = {}): void {
        let { replacementGameAction } = this.getProperties(event.context, additionalProperties);
        if(replacementGameAction) {
            let events = []
            let eventWindow = event.context.event.window;
            replacementGameAction.addEventsToArray(events, event.context, additionalProperties)
            event.context.game.queueSimpleStep(() => {
                if(events.length > 1) {
                    throw new Error('Multiple replacement events found');
                }
                if(!event.context.event.isSacrifice) {
                    event.context.event.replacementEvent = events[0];
                }
                eventWindow.addEvent(events[0]);
            });
        }
        event.context.cancel();
    }

    canAffect(target: any, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context, additionalProperties);
        return !replacementGameAction || replacementGameAction.canAffect(target, context, additionalProperties);
    }

    defaultTargets(context: TriggeredAbilityContext): any[] {
        return context.event.card ? [context.event.card] : [];
    }
}
