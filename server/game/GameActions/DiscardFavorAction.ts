import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');

export interface DiscardFavorProperties extends PlayerActionProperties {
}

export class DiscardFavorAction extends PlayerAction {
    name = 'discardFavor';
    eventName = EventNames.OnDiscardFavor;
    cost = 'discarding the Imperial Favor';
    effect = 'make {0} lose the Imperial Favor';

    canAffect(player: Player, context: AbilityContext): boolean {
        return player.imperialFavor && super.canAffect(player, context);
    }

    eventHandler(event): void {
        event.player.loseImperialFavor();
    }
}
