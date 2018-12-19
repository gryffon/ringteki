import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');

export interface DiscardFavorProperties extends PlayerActionProperties {
}

export class DiscardFavorAction extends PlayerAction {
    name = 'discardFavor';
    cost = 'discarding the Imperial Favor';
    effect = 'make {0} lose the Imperial Favor';

    canAffect(player: Player, context: AbilityContext): boolean {
        return player.imperialFavor && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnDiscardFavor, { player: player, context: context }, () => player.loseImperialFavor());
    }
}
