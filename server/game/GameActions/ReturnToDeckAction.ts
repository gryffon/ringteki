import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
}

export class ReturnToDeckAction extends CardGameAction {
    name = 'returnToDeck';
    eventName = EventNames.OnCardLeavesPlay;
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: ReturnToDeckProperties = {
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
            return['shuffle {0} into their deck', [properties.target]]
        }
        return ['return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck', [properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card.location === Locations.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event, card, context, additionalProperties) {
        let { shuffle, target, bottom } = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Locations.DynastyDeck : Locations.ConflictDeck;
        event.options = { bottom };
        if(shuffle && (target.length === 0 || card === target[target.length - 1])) {
            event.shuffle = true;
        }
    }

    eventHandler(event) {
        this.leavesPlayEventHandler(event);
        if(event.shuffle) {
            if(event.destination === Locations.DynastyDeck) {
                event.card.owner.shuffleDynastyDeck();
            } else if(event.destination === Locations.ConflictDeck) {
                event.card.owner.shuffleConflictDeck();
            }
        }
    }
}
