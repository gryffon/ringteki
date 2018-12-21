import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import LeavesPlayEvent = require('../Events/LeavesPlayEvent');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface ReturnToDeckProperties extends CardActionProperties {
    location?: Locations;
    ignoreLocation?: boolean;
    bottom?: boolean;
    shuffle?: boolean;
}

export class ReturnToDeckAction extends CardGameAction {
    name = 'returnToDeck';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: ReturnToDeckProperties = {
        location: Locations.PlayArea,
        ignoreLocation: false,
        bottom: false,
        shuffle: false
     };
    constructor(properties: ((context: AbilityContext) => ReturnToDeckProperties) | ReturnToDeckProperties) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        return [properties.shuffle ? 'reshuffling {0} into their deck' : 'returning {0} to their deck', []];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        if(properties.shuffle) {
            return['shuffle {0} into their deck', []]
        }
        return ['return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck',[]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        if(!properties.ignoreLocation && card.location !== properties.location) {
            return false;
        }
        return super.canAffect(card, context);
    }
    
    getEvent(card: DrawCard, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        let destination = card.isDynasty ? Locations.DynastyDeck : Locations.ConflictDeck;
        let target = properties.target as any[];
        if(card.location === Locations.PlayArea) {
            return new LeavesPlayEvent({ context: context, destination: destination, options: { bottom: properties.bottom, shuffle: properties.shuffle } }, card, this);
        }
        return this.createEvent(EventNames.Unnamed, { card: card, context: context }, event => {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location, context);
            }
            card.owner.moveCard(card, destination, { bottom: properties.bottom });
            if(properties.shuffle && (target.length === 0 || card === target[target.length - 1])) {
                if(destination === Locations.DynastyDeck) {
                    card.owner.shuffleDynastyDeck();
                } else {
                    card.owner.shuffleConflictDeck();
                }
            }    
        });
    }
}
