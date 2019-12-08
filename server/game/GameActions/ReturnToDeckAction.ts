import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Locations | Locations[];
}

export class ReturnToDeckAction extends CardGameAction {
    name = 'returnToDeck';
    eventName = EventNames.OnCardLeavesPlay;
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: ReturnToDeckProperties = {
        bottom: false,
        shuffle: false,
        location: Locations.PlayArea
     };
    constructor(properties: ((context: AbilityContext) => ReturnToDeckProperties) | ReturnToDeckProperties) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        return [properties.shuffle ? 'shuffling {0} into their deck' : 'returning {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck', [properties.target]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        if(properties.shuffle) {
            return['shuffle {0} into their deck', [properties.target]]
        }
        return ['return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck', [properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        let location = properties.location;
        if(!Array.isArray(location)) {
            location = [location];
        }
        let index = location.indexOf(Locations.Provinces);
        if(index > -1) {
            location.splice(index, 1, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince);
        }

        return (location.includes(Locations.Any) || location.includes(card.location)) && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { shuffle, target, bottom } = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Locations.DynastyDeck : Locations.ConflictDeck;
        event.options = { bottom };
        if(shuffle && (target.length === 0 || card === target[target.length - 1])) {
            event.shuffle = true;
        }
    }

    eventHandler(event, additionalProperties = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
        if(event.shuffle) {
            if(event.destination === Locations.DynastyDeck) {
                event.card.owner.shuffleDynastyDeck();
            } else if(event.destination === Locations.ConflictDeck) {
                event.card.owner.shuffleConflictDeck();
            }
        }
    }
}
