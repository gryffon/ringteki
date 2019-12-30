import AbilityContext = require('../AbilityContext');
import { ResolveElementAction } from './ResolveElementAction';
import Player = require('../player');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export class ResolveConflictRingAction extends RingAction {
    name = 'resolveRing';
    eventName = EventNames.OnResolveConflictRing;
    constructor(properties: ((context: AbilityContext) => RingActionProperties) | RingActionProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: RingActionProperties = this.getProperties(context);
        return ['resolve {0}', [properties.target]];
    }

    addPropertiesToEvent(event, ring: Ring, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        let conflict = context.game.currentConflict;

        event.conflict = conflict;
        event.player = context.player;
    }

    eventHandler(event, additionalProperties): void {
        if(event.name !== this.eventName) {
            return;
        }
        let properties: RingActionProperties = this.getProperties(event.context, additionalProperties);
        let elements = event.ring.getElements();
        let player = event.player
        if(elements.length === 1) {
            this.resolveRingEffects(player, elements);
        } else {
            this.chooseElementsToResolve(player, elements, event.conflict.elementsToResolve);
        }
    }

    chooseElementsToResolve(player: Player, elements: string[], elementsToResolve: number, chosenElements: string[] = []): void {
        if(elements.length === 0 || elementsToResolve === 0) {
            this.resolveRingEffects(player, chosenElements);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve (click the ring you want to resolve)';
        if(chosenElements.length > 0) {
            activePromptTitle = chosenElements.reduce((string, element) => string + ' ' + element, activePromptTitle + '\nChosen elements:');
        }
        let buttons = [];

        if(chosenElements.length > 0) {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        if(elementsToResolve >= elements.length) {
            buttons.push({ text: 'Resolve All Elements', arg: 'all' });
        }
        buttons.push({ text: 'Don\'t Resolve the Conflict Ring', arg: 'cancel' });

        player.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            buttons: buttons,
            source: 'Resolve Ring Effect',
            ringCondition: ring => elements.includes(ring.element),
            onSelect: (player, ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(player, elements.filter(e => e !== ring.element), elementsToResolve, chosenElements);
                return true;
            },
            onCancel: player => player.game.addMessage('{0} chooses not to resolve the conflict ring', player),
            onMenuCommand: (player, arg) => {
                if(arg === 'all') {
                    this.resolveRingEffects(player, elements.concat(chosenElements));
                } else if(arg === 'done') {
                    this.resolveRingEffects(player, chosenElements);
                }
                return true;
            }
        });
    }

    resolveRingEffects(player: Player, elements: string[], optional: boolean = true): void {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        let rings = elements.map(element => player.game.rings[element]);
        let action = new ResolveElementAction({ target: rings, optional: optional, physicalRing: player.game.currentConflict.ring });
        let events = [];
        action.addEventsToArray(events, player.game.getFrameworkContext(player));
        player.game.openThenEventWindow(events);
    }
}
