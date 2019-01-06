import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface TransferFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class TransferFateAction extends PlayerAction {
    name = 'takeFate';
    eventName = EventNames.OnMoveFate;
    defaultProperties: TransferFateProperties = { amount: 1 };

    constructor(propertyFactory: TransferFateProperties | ((context: AbilityContext) => TransferFateProperties)) {
        super(propertyFactory);
    }
    
    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['take {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferFateProperties;
        return player.opponent && properties.amount > 0 && player.fate >= properties.amount && super.canAffect(player, context);
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as TransferFateProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.fate = amount;
        event.origin = player;
        event.recipient = player.opponent;
    }

    checkEventCondition(event): boolean {
        return this.moveFateEventCondition(event);
    }

    eventHandler(event): void {
        this.moveFateEventHandler(event);
    }
}
