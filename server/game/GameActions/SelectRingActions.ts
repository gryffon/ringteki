import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties } from './RingAction';
import { Players } from '../Constants';
import { GameAction } from './GameAction';

export interface SelectRingProperties extends RingActionProperties {
    activePromptTitle?: string;
    player?: Players;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    message?: string;
    messageArgs?: (ring: Ring, action: GameAction) => any[];
    gameAction: GameAction;
}

export class SelectRingAction extends RingAction {
    defaultProperties: SelectRingProperties = {
        ringCondition: () => true,
        gameAction: null
    };

    constructor(properties: SelectRingProperties | ((context: AbilityContext) => SelectRingProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['choose a ring for {0}', [target]];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return false;
        }
        return super.canAffect(ring, context) && properties.ringCondition(ring, context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return Object.values(context.game.rings).some((ring: Ring) => this.canAffect(ring, context, additionalProperties));
    }

    addEventsToArray(events, context: AbilityContext, additionalProperties = {}): void {
        let properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if(!Object.values(context.game.rings).some((ring: Ring): boolean => properties.ringCondition(ring, context))) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let defaultProperties = {
            context: context,
            onSelect: (player, ring) => {
                if(properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(ring, properties.gameAction));
                }
                properties.gameAction.addEventsToArray(events, context, { target: ring });
                return true;
            }
        };
        context.game.promptForRingSelect(player, Object.assign(defaultProperties, properties));
    }
}
