import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames, ConflictTypes, EffectNames } from '../Constants';

export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictTypes;
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
        let properties = this.getProperties(context) as InitiateConflictProperties;
        let availableTotalConflicts = player.conflictOpportunities['total'];
        if(availableTotalConflicts === 0) {
            // no remaining conflicts
            return false;
        }
        let prohibitedConflictTypes = player.getEffects(EffectNames.CannotDeclareConflictsOfType);
        let availableConflictTypes = ['military', 'political'].filter(type => player.getConflictOpportunities(type) && !prohibitedConflictTypes.includes(type));
        if(properties.forcedDeclaredType && !player.cardsInPlay.any(card => card.canDeclareAsAttacker(properties.forcedDeclaredType))) {
            // No legal attackers for forced declared type
            return false;
        } else if(!player.cardsInPlay.any(card => availableConflictTypes.some(type => card.canDeclareAsAttacker(type)))) {
            // No legal attackerss
            return false;
        } else if(!Object.values(context.game.rings).some(ring => ring.canDeclare(player))) {
            // No legal rings
            return false;
        }
        return super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties) as InitiateConflictProperties;
        event.context.game.initiateConflict(event.player, properties.canPass, properties.forcedDeclaredType)
    }
}
