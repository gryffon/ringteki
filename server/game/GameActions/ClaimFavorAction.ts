import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { GameAction, GameActionProperties } from './GameAction';

export interface ClaimFavorProperties extends PlayerActionProperties {
    target: Player | null;
}

export class ClaimFavorAction extends PlayerAction {
    name = 'discardFavor';
    eventName = EventNames.OnClaimFavor;
    effect = 'claim the Emperor\'s favor';

    hasLegalTarget(): boolean {
        return true;
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ClaimFavorProperties;
        let target = properties.target;

        return player && !player.imperialFavor && super.canAffect(player, context);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ClaimFavorProperties {
        let properties = super.getProperties(context, additionalProperties) as ClaimFavorProperties;
        return properties;
    }

    eventHandler(event): void {
        if(event.player)
            event.player.claimImperialFavor();
    }
}
