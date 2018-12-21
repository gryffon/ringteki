import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import { ResolveElementAction } from './ResolveElementAction';
import Player = require('../player');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface ResolveConflictRingProperties extends RingActionProperties {
    resolveAsAttacker?: boolean;
}

export class ResolveConflictRingAction extends RingAction {
    name = 'resolveRing';
    defaultProperties: ResolveConflictRingProperties = { resolveAsAttacker: true };
    constructor(properties: ((context: AbilityContext) => ResolveConflictRingProperties) | ResolveConflictRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: ResolveConflictRingProperties = this.getProperties(context);
        return ['resolve {0}' + (properties.resolveAsAttacker ? '' : ' for the attacking player'),[]];
    }
    
    getEvent(ring: Ring, context: AbilityContext, additionalProperties = {}): Event {
        let properties: ResolveConflictRingProperties = this.getProperties(context, additionalProperties);
        let conflict = context.game.currentConflict;
        if(!conflict && !properties.resolveAsAttacker) {
            return this.createEvent(EventNames.Unnamed, {}, () => true);
        }
        let player = properties.resolveAsAttacker ? context.player : context.game.currentConflict.attackingPlayer;
        let elements = ring.getElements();
        return this.createEvent(EventNames.OnResolveConflictRing, { player: player, conflict: conflict, ring: ring, context: context }, () => {
            if(elements.length === 1 || (!properties.resolveAsAttacker && conflict.elementsToResolve >= elements.length)) {
                this.resolveRingEffects(player, elements, properties.resolveAsAttacker);
            } else {
                this.chooseElementsToResolve(player, elements, properties.resolveAsAttacker, conflict.elementsToResolve);
            }
        });
    }

    chooseElementsToResolve(player, elements, optional, elementsToResolve, chosenElements = []) {
        if(elements.length === 0 || elementsToResolve === 0) {
            this.resolveRingEffects(player, chosenElements, optional);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve (click the ring you want to resolve)';
        if(chosenElements.length > 0) {
            activePromptTitle = chosenElements.reduce((string, element) => string + ' ' + element, activePromptTitle + '\nChosen elements:');
        }
        let buttons = [];
        if(optional) {
            if(chosenElements.length > 0 && optional) {
                buttons.push({ text: 'Done', arg: 'done' });
            }
            if(elementsToResolve >= elements.length) {
                buttons.push({ text: 'Resolve All Elements', arg: 'all' });
            }
            buttons.push({ text: 'Don\'t Resolve the Conflict Ring', arg: 'cancel' });
        }
        player.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            buttons: buttons,
            source: 'Resolve Ring Effect',
            ringCondition: ring => elements.includes(ring.element),
            onSelect: (player, ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(player, elements.filter(e => e !== ring.element), optional, elementsToResolve, chosenElements);
                return true;
            },
            onCancel: player => player.game.addMessage('{0} chooses not to resolve the conflict ring', player),
            onMenuCommand: (player, arg) => {
                if(arg === 'all') {
                    this.resolveRingEffects(player, elements.concat(chosenElements));
                } else if(arg === 'done') {
                    this.resolveRingEffects(player, chosenElements, optional);
                }
                return true;
            }
        });
    }

    resolveRingEffects(player, elements, optional = true) {
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
