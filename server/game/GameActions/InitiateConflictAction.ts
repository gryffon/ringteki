import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
}

export class InitiateConflictAction extends PlayerAction {
    name = 'initiateConflict';
    eventName = EventNames.OnConflictInitiated;
    effect = 'declare a new conflict';
    defaultProperties: InitiateConflictProperties = {
        canPass: true
    };
    constructor(properties: InitiateConflictProperties | ((context: AbilityContext) => InitiateConflictProperties)) {
        super(properties);
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let availableConflictTypes = ['military', 'political'].filter(type => player.getConflictOpportunities(type));
        if(!player.cardsInPlay.any(card => availableConflictTypes.some(type => card.canDeclareAsAttacker(type)))) {
            // No legal attackers
            return false;
        } else if(!Object.values(context.game.rings).some(ring => ring.canDeclare(player))) {
            // No legal rings
            return false;
        }
        return super.canAffect(player, context);
    }

    defaultTargets(context) {
        return [context.player];
    }

    eventHandler(event, additionalProperties) {
        let { canPass } = this.getProperties(event.context, additionalProperties) as InitiateConflictProperties;
        event.context.game.initiateConflict(event.player, canPass)
    }
}
