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
    eventName = EventNames.OnSetHonorDial;
    constructor(propertyFactory: SetDialProperties | ((context: AbilityContext) => SetDialProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as SetDialProperties;
        return ['set {0}\'s dial to {1}', [properties.target, properties.value]]
    }

    canAffect(player, context, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties) as SetDialProperties;
        return properties.value > 0 && super.canAffect(player, context);
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { value } = this.getProperties(context, additionalProperties) as SetDialProperties;
        super.getEventProperties(event, player, context, additionalProperties);
        event.value = value;
    }

    eventHandler(event) {
        event.player.setShowBid(event.value);
    }
}
