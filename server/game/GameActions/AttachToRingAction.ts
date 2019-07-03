import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Ring = require('../ring');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, EventNames }  from '../Constants';

export interface AttachToRingActionProperties extends CardActionProperties {
    attachment?: DrawCard,
}

export class AttachToRingAction extends CardGameAction {
    name = 'attachToRing';
    eventName = EventNames.OnCardAttached;
    targetType = ['ring'];
    
    constructor(properties: ((context: AbilityContext) => AttachToRingActionProperties) | AttachToRingActionProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as AttachToRingActionProperties;
        return ['attach {1} to {0}', [properties.target, properties.attachment]];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as AttachToRingActionProperties;
        if(!context || !context.player || !ring) {
            return false;
        } else if(!properties.attachment || properties.attachment.anotherUniqueInPlay(context.player) || !properties.attachment.canAttach(ring, context)) {
            return false;
        }
        return super.canAffect(ring, context);
    }
    
    checkEventCondition(event, additionalProperties): boolean {
        return this.canAffect(event.parent, event.context, additionalProperties);
    }

    isEventFullyResolved(event, card: DrawCard, context: AbilityContext, additionalProperties): boolean {
        let { attachment } = this.getProperties(context, additionalProperties) as AttachToRingActionProperties;
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { attachment } = this.getProperties(context, additionalProperties) as AttachToRingActionProperties;
        event.name = this.eventName;
        event.parent = card;
        event.card = attachment;
        event.context = context;
    }

    eventHandler(event): void {
        if(event.card.location === Locations.PlayArea) {
            event.card.parent.removeAttachment(event.card);
        } else {
            event.card.controller.removeCardFromPile(event.card);
            event.card.new = true;
            event.card.moveTo(Locations.PlayArea);
        }
        event.parent.attachments.push(event.card);
        event.card.parent = event.parent;
        if(event.card.controller !== event.context.player) {
            event.card.controller = event.context.player;
            event.card.updateEffectContexts();
        }
    }
}
