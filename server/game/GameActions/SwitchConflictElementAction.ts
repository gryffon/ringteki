import { RingAction, RingActionProperties } from './RingAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');

export interface SwitchConflictElementProperties extends RingActionProperties {}

export class SwitchConflictElementAction extends RingAction {
    name = 'switchConflictElement';
    cost = 'switching the contested ring to {0}';
    effect = 'switch the contested ring to {0}';
    eventName = EventNames.OnSwitchConflictElement;

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        return ring.isUnclaimed() && context.game.isDuringConflict() && 
            super.canAffect(ring, context, additionalProperties);
    }

    eventHandler(event): void {
        event.context.game.currentConflict.switchElement(event.ring.element);
    }
}