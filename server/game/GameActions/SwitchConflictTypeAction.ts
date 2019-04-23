import { GameAction, GameActionProperties } from './GameAction';
import TriggeredAbilityContext = require('../TriggeredAbilityContext');
import { ConflictTypes, EventNames } from '../Constants';

export interface SwitchConflictTypeProperties extends GameActionProperties {
    targetConflictType?: ConflictTypes
}

export class SwitchConflictTypeAction extends GameAction {
    name = 'switchConflictType';
    eventName = EventNames.OnSwitchConflictType;

    getCostMessage(context: TriggeredAbilityContext): [string, any[]] {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType = currentConflictType === ConflictTypes.Military ? ConflictTypes.Political : ConflictTypes.Military;
        return ['switching the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    getEffectMessage(context: TriggeredAbilityContext): [string, any[]] {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType = currentConflictType === ConflictTypes.Military ? ConflictTypes.Political : ConflictTypes.Military;
        return ['switch the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    getProperties(context: TriggeredAbilityContext, additionalProperties = {}): SwitchConflictTypeProperties {
        let properties = super.getProperties(context, additionalProperties) as SwitchConflictTypeProperties;
        return properties;
    }

    hasLegalTarget(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { targetConflictType } = this.getProperties(context);
        if(!context.game.currentConflict) {
            return false;
        }
        let currentConflictType = context.game.currentConflict.conflictType;
        if(targetConflictType === currentConflictType) {
            return false;
        }
        return true;
    }

    eventHandler(event): void {
        event.context.game.switchConflictType();
    }
}
