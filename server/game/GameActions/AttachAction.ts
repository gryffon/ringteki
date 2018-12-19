import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface AttachActionProperties extends CardActionProperties {
    attachment?: DrawCard,
}

export class AttachAction extends CardGameAction {
    name = 'attach';
    targetType = [CardTypes.Character];
    
    constructor(properties: ((context: AbilityContext) => AttachActionProperties) | AttachActionProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as AttachActionProperties;
        return ['attach {1} to {0}', [properties.attachment]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as AttachActionProperties;
        if(!context || !context.player || !card || card.location !== Locations.PlayArea) {
            return false;
        } else if(!properties.attachment || properties.attachment.anotherUniqueInPlay(context.player) || !properties.attachment.canAttach(card, context)) {
            return false;
        }
        return card.allowAttachment(properties.attachment) && super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        let properties = this.getProperties(context) as AttachActionProperties;
        return super.createEvent(EventNames.OnCardAttached, { card: properties.attachment, parent: card, context: context }, (event: any): void => {
            if(event.card.location === Locations.PlayArea) {
                event.card.parent.removeAttachment(event.card);
            } else {
                event.card.controller.removeCardFromPile(event.card);
                event.card.new = true;
                event.card.moveTo(Locations.PlayArea);
            }
            event.parent.attachments.push(event.card);
            event.card.parent = event.parent;
            if(event.card.controller !== context.player) {
                event.card.controller = context.player;
                for(let effect of event.card.abilities.persistentEffects) {
                    if(effect.ref) {
                        for(let e of effect.ref) {
                            e.refreshContext();
                        }
                    }
                }
            }
        });
    }
    
    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }
}
