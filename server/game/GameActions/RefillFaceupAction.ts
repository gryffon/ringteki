import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames, Locations } from '../Constants';

export interface RefillFaceupProperties extends PlayerActionProperties {
    location: Locations;
}

export class RefillFaceupAction extends PlayerAction {
    defaultProperties: RefillFaceupProperties;

    name = 'refill';
    effect = 'refill its province faceup';
    constructor(propertyFactory: RefillFaceupProperties | ((context: AbilityContext) => RefillFaceupProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties = this.getProperties(context) as RefillFaceupProperties;
        return super.createEvent(EventNames.Unnamed, { player, context }, () => {
            if(player.replaceDynastyCard(properties.location) !== false) {
                context.game.queueSimpleStep(() => {
                    let card = player.getDynastyCardInProvince(properties.location);
                    if(card) {
                        card.facedown = false;
                    }
                });
            }
        });
    }
}
