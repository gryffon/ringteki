const _ = require('underscore');
const GameActionCost = require('./GameActionCost');
const { Locations, Players } = require('../Constants');

class MetaActionCost extends GameActionCost {
    constructor(action, activePromptTitle) {
        super(action);
        this.activePromptTitle = activePromptTitle;
    }

    getActionName(context) {
        const { gameAction } = this.action.getProperties(context);
        return gameAction.name;
    }

    canPay(context) {
        const properties = this.action.getProperties(context);
        let additionalProps = {
            controller: Players.Self,
            location: properties.location || Locations.Any
        };
        return this.action.hasLegalTarget(context, additionalProps);
    }

    addEventsToArray(events, context, result) {
        const properties = this.action.getProperties(context);
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
            additionalProperties: target => {
                context.costs[properties.gameAction.name] = target;
                if(target.createSnapshot) {
                    context.costs[properties.gameAction.name + 'StateWhenChosen'] = target.createSnapshot();
                }
                return properties.additionalProperties ? properties.additionalProperties(target) : {};
            }
        };
        if(result.canCancel) {
            additionalProps.cancelHandler = (() => result.cancelled = true);
        }
        this.action.addEventsToArray(events, context, additionalProps);
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        return this.action.hasTargetsChosenByInitiatingPlayer(context);
    }

    getCostMessage(context) {
        const properties = this.action.getProperties(context);
        return properties.gameAction.getCostMessage(context);
    }
}

module.exports = MetaActionCost;
