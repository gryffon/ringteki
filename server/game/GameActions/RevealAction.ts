import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');
import Player = require('../player');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, EventNames }  from '../Constants';

export interface RevealProperties extends CardActionProperties {
    chatMessage?: boolean;
    player?: Player;
}

export class RevealAction extends CardGameAction {
    name = 'reveal';
    effect = 'reveal a card';
    cost = 'revealing {0}';
    defaultProperties: RevealProperties = { chatMessage: false };
    constructor(properties: ((context: AbilityContext) => RevealProperties) | RevealProperties) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let testLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince, Locations.PlayArea];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }
    
    getEvent(card: BaseCard, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as RevealProperties;
        return super.createEvent(EventNames.OnCardRevealed, { card, context }, event => {
            if(properties.chatMessage) {
                context.game.addMessage('{0} reveals {1} due to {2}', properties.player || context.player, card, context.source);
            }
            event.card.facedown = false;
        });
    }
}
