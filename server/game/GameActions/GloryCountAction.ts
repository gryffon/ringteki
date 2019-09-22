import { GameAction, GameActionProperties } from './GameAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');

export interface GloryCountProperties extends GameActionProperties {
    postHandler?: (event) => void;
}

export class GloryCountAction extends GameAction {
    name = 'gloryCount';
    eventName = EventNames.OnGloryCount;
    effect = 'perform a glory count';
    defaultProperties: GloryCountProperties = {
        postHandler: () => true
    };
    
    hasLegalTarget(): boolean {
        return true;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event, additionalProperties): void {
        const { postHandler } = this.getProperties(event.context, additionalProperties) as GloryCountProperties;
        const gloryTotals = event.context.game.getPlayersInFirstPlayerOrder().map(player => {
            return player.getGloryCount();
        });
        const firstPlayer = event.context.game.getFirstPlayer();
        if(firstPlayer.opponent && gloryTotals[1] >= gloryTotals[0]) {
            event.winnerTotal = gloryTotals[1];
            event.loserTotal = gloryTotals[0];
            if(gloryTotals[1] > gloryTotals[0]) {
                event.loser = firstPlayer;
                event.winner = firstPlayer.opponent;
            }
        } else {
            event.winner = firstPlayer;
            event.winnerTotal = gloryTotals[0];
            event.loser = firstPlayer.opponent;
            event.loserTotal = gloryTotals[1] || 0;
        }
        postHandler(event);
    }
}
