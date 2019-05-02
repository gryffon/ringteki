const _ = require('underscore');
import GameActionCost = require('./GameActionCost');
import { SelectCardProperties } from '../GameActions/SelectCardAction'; 
import { Locations, Players } from '../Constants';
import AbilityContext = require('../AbilityContext');

class MetaActionCost extends GameActionCost {
    activePromptTitle: string;
    
    constructor(action, activePromptTitle) {
        super(action);
        this.activePromptTitle = activePromptTitle;
    }

    getActionName(context: AbilityContext): string {
        const { gameAction } = this.action.getProperties(context) as SelectCardProperties;
        return gameAction.name;
    }

    canPay(context: AbilityContext): boolean {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        let additionalProps = {
            controller: Players.Self,
            location: properties.location || Locations.Any
        };
        return this.action.hasLegalTarget(context, additionalProps);
    }

    addEventsToArray(events: any[], context: AbilityContext, result): void {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        if(properties.targets && context.choosingPlayerOverride) {
            context.costs[properties.gameAction.name] = _.shuffle(properties.selector.getAllLegalTargets(context, context.player))[0];
            context.costs[properties.gameAction.name + 'StateWhenChosen'] = context.costs[properties.gameAction.name].createSnapshot();
            properties.gameAction.addEventsToArray(events, context, { target: context.costs[properties.gameAction.name] });
            return;
        }
        const additionalProps = {
            activePromptTitle: this.activePromptTitle,
            location: properties.location || Locations.Any,
            controller: Players.Self,
            cancelHandler: null,
            subActionProperties: target => {
                context.costs[properties.gameAction.name] = target;
                if(target.createSnapshot) {
                    context.costs[properties.gameAction.name + 'StateWhenChosen'] = target.createSnapshot();
                }
                return properties.subActionProperties ? properties.subActionProperties(target) : {};
            }
        };
        if(result.canCancel) {
            additionalProps.cancelHandler = (() => result.cancelled = true);
        }
        this.action.addEventsToArray(events, context, additionalProps);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.action.hasTargetsChosenByInitiatingPlayer(context);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        return properties.gameAction.getCostMessage(context);
    }
}

export = MetaActionCost;
