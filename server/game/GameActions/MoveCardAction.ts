import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface MoveCardProperties extends CardActionProperties {
    destination: Locations;
    switch?: boolean;
    shuffle?: boolean;
    faceup?: boolean;
    bottom?: boolean;
}

export class MoveCardAction extends CardGameAction {
    name = 'move';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    effect = 'move {0}';
    defaultProperties: MoveCardProperties = {
        destination: null,
        switch: false,
        shuffle: false,
        faceup: false,
        bottom: false
    };
    constructor(properties: MoveCardProperties | ((context: AbilityContext) => MoveCardProperties)) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as MoveCardProperties;        
        return ['shuffling {0} into their deck', [properties.target]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.location !== Locations.PlayArea && super.canAffect(card, context);
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let card = event.card;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties) as MoveCardProperties;        
        if(properties.switch) {
            let otherCard = card.controller.getDynastyCardInProvince(properties.destination);
            card.owner.moveCard(otherCard, card.location);
        } else if(card.isInProvince() && card.location !== Locations.StrongholdProvince) {
            event.context.refillProvince(card.owner, card.location);
        }
        card.owner.moveCard(card, properties.destination, { bottom: !!properties.bottom });
        let target = properties.target;
        if(properties.shuffle && (target.length === 0 || card === target[target.length - 1])) {
            if(properties.destination === Locations.ConflictDeck) {
                event.card.owner.shuffleConflictDeck();
            } else if(properties.destination === Locations.DynastyDeck) {
                event.card.owner.shuffleDynastyDeck();
            }
        } else if(properties.faceup) {
            card.facedown = false;
        }
    }
}
