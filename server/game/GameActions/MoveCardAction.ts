import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface MoveCardProperties extends CardActionProperties {
    destination: Locations;
    switch?: boolean;
    shuffle?: boolean;
    faceup?: boolean;
}

export class MoveCardAction extends CardGameAction {
    name = 'move';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    effect = 'move {0}';
    defaultProperties: MoveCardProperties = {
        destination: null,
        switch: false,
        shuffle: false,
        faceup: false
    };
    constructor(properties: MoveCardProperties | ((context: AbilityContext) => MoveCardProperties)) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.location !== Locations.PlayArea && super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        let properties = this.getProperties(context) as MoveCardProperties;
        return super.createEvent(EventNames.Unnamed, { card: card, context: context }, event => {
            if(properties.switch) {
                let otherCard = card.controller.getDynastyCardInProvince(properties.destination);
                context.player.moveCard(otherCard, card.location);
            } else if([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location)) {
                event.context.refillProvince(context.player, card.location);
            }
            context.player.moveCard(card, properties.destination);
            if(properties.shuffle) {
                if(properties.destination === Locations.ConflictDeck) {
                    context.player.shuffleConflictDeck();
                } else if(properties.destination === Locations.DynastyDeck) {
                    context.player.shuffleDynastyDeck();
                }
            } else if(properties.faceup) {
                card.facedown = false;
            }
        });
    }
}
