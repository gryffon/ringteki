import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Ring = require('../ring');
import EffectSource = require('../EffectSource');
import { CardTypes, Locations } from '../Constants.js';

export interface CardActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export class CardGameAction extends GameAction {
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding, CardTypes.Event, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role, 'ring'];

    defaultTargets(context: AbilityContext): EffectSource[] {
        return [context.source];
    }

    checkEventCondition(event: any, additionalProperties = {}): boolean {
        return this.canAffect(event.card, event.context, additionalProperties);
    }

    canAffect(target: BaseCard | Ring, context: AbilityContext, additionalProperties = {}) {
        return super.canAffect(target, context, additionalProperties);
    }

    addPropertiesToEvent(event, card: BaseCard, context: AbilityContext, additionalProperties = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.card = card;
    }

    isEventFullyResolved(event, card: BaseCard, context: AbilityContext, additionalProperties): boolean {
        return event.card === card && super.isEventFullyResolved(event, card, context, additionalProperties);
    }

    updateLeavesPlayEvent(event, card: BaseCard, context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context, additionalProperties) as any;
        super.updateEvent(event, card, context, additionalProperties);
        event.isSacrifice = this.name === 'sacrifice';
        event.destination = properties.destination || (card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        event.preResolutionEffect = () => {
            event.cardStateWhenLeftPlay = event.card.createSnapshot();
            if(event.card.isAncestral() && event.isContingent) {
                event.destination = Locations.Hand;
                context.game.addMessage('{0} returns to {1}\'s hand due to its Ancestral keyword', event.card, event.card.owner);
            }
        };
        event.createContingentEvents = () => {
            let contingentEvents = [];
            // Add an imminent triggering condition for all attachments leaving play
            if(event.card.attachments) {
                event.card.attachments.each(attachment => {
                    // we only need to add events for attachments that are in play.
                    if(attachment.location === Locations.PlayArea) {
                        let attachmentEvent = context.game.actions.discardFromPlay().getEvent(attachment, context.game.getFrameworkContext());
                        attachmentEvent.order = event.order - 1;
                        let previousCondition = attachmentEvent.condition;
                        attachmentEvent.condition = attachmentEvent => previousCondition(attachmentEvent) && attachment.parent === event.card;
                        attachmentEvent.isContingent = true;
                        contingentEvents.push(attachmentEvent);
                    }
                });
            }
            // Add an imminent triggering condition for removing fate
            if(event.card.fate > 0) {
                let fateEvent = context.game.actions.removeFate({ amount: event.card.fate }).getEvent(event.card, context.game.getFrameworkContext());
                fateEvent.order = event.order - 1;
                fateEvent.isContingent = true;
                contingentEvents.push(fateEvent);
            }
            return contingentEvents;    
        }
    }

    leavesPlayEventHandler(event, additionalProperties = {}): void {
        this.checkForRefillProvince(event.card, event, additionalProperties);
        if(!event.card.owner.isLegalLocationForCard(event.card, event.destination)) {
            event.card.game.addMessage('{0} is not a legal location for {1} and it is discarded', event.destination, event.card);
            event.destination = event.card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile;
        }
        event.card.owner.moveCard(event.card, event.destination, event.options || {});
    }

    checkForRefillProvince(card: BaseCard, event, additionalProperties: any = {}): void {
        if(!card.isInProvince() || card.location === Locations.StrongholdProvince) {
            return;
        }
        const context = !!additionalProperties.replacementEffect ? event.context.event.context : event.context;
        context.refillProvince(card.controller, card.location);
    }
}
