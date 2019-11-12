import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import BaseCardSelector = require('../CardSelectors/BaseCardSelector');
import CardSelector = require('../CardSelector');
import Player = require('../player');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { CardTypes, Players, Locations, EffectNames, TargetModes } from '../Constants';
import { GameAction } from './GameAction';

export interface SelectCardProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players;
    cardType?: CardTypes | CardTypes[];
    controller?: Players;
    location?: Locations | Locations[];
    cardCondition?: (card: BaseCard, context: AbilityContext) => boolean;
    targets?: boolean;
    message?: string;
    messageArgs?: (card: BaseCard, player: Player, properties: SelectCardProperties) => any[];
    gameAction: GameAction;
    selector?: BaseCardSelector;
    mode?: TargetModes;
    subActionProperties?: (card: BaseCard) => any;
    cancelHandler?: () => void;
}

export class SelectCardAction extends CardGameAction {
    defaultProperties: SelectCardProperties = {
        cardCondition: () => true,
        gameAction: null,
        subActionProperties: card => ({ target: card }),
        targets: false
    };

    constructor(properties: SelectCardProperties | ((context: AbilityContext) => SelectCardProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['choose a target for {0}', [target]];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): SelectCardProperties {
        let properties = super.getProperties(context, additionalProperties) as SelectCardProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        if(!properties.selector) {
            let cardCondition = (card, context) =>
                properties.gameAction.allTargetsLegal(context, Object.assign({}, additionalProperties, properties.subActionProperties(card))) &&
                properties.cardCondition(card, context);
            properties.selector = CardSelector.for(Object.assign({}, properties, { cardCondition }));
        }
        return properties;
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let player = properties.targets && context.choosingPlayerOverride || properties.player === Players.Opponent && context.player.opponent || context.player;
        return properties.selector.canTarget(card, context, player);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let player = properties.targets && context.choosingPlayerOverride || properties.player === Players.Opponent && context.player.opponent || context.player;
        return properties.selector.hasEnoughTargets(context, player);
    }

    addEventsToArray(events, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let mustSelect = [];
        if(properties.targets) {
            player = context.choosingPlayerOverride || player;
            mustSelect = properties.selector.getAllLegalTargets(context, player).filter(card =>
                card.getEffects(EffectNames.MustBeChosen).some(restriction => restriction.isMatch('target', context))
            );
        }
        if(!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }
        let defaultProperties = {
            context: context,
            selector: properties.selector,
            mustSelect: mustSelect,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player, cards) => {
                if(properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(cards, player, properties));
                }
                properties.gameAction.addEventsToArray(events, context, Object.assign(
                    { parentAction: this },
                    additionalProperties,
                    properties.subActionProperties(cards)
                ));

                if(properties.gameAction.properties)
                    properties.gameAction.properties.target = cards;
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(defaultProperties, properties));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.targets && properties.player !== Players.Opponent;
    }
}
