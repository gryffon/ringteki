import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface SetDialProperties extends PlayerActionProperties {
    value: number;
}

export class SetDialAction extends PlayerAction {
    defaultProperties: SetDialProperties = { value: 0 };

    name = 'setDial';
    constructor(propertyFactory: SetDialProperties | ((context: AbilityContext) => SetDialProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as SetDialProperties;
        return ['set {0}\'s dial to {1}', [properties.value]]
    }

    canAffect(player, context) {
        let properties = this.getProperties(context) as SetDialProperties;
        return properties.value > 0 && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties = this.getProperties(context) as SetDialProperties;
        let value = properties.value;
        return super.createEvent(EventNames.OnSetHonorDial, { player, context, value }, event => {
            event.player.setShowBid(event.value);
        });
    }
}
