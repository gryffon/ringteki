const _ = require('underscore');

class AbilityTargetCard {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return _.any(context.game.rings, ring => this.properties.ringCondition(ring)) && context.ability.canPayCosts(context);
    }

    updateGameActions(context) {
        for(let action of this.properties.gameAction) {
            action.target(context => context.targets[this.name]);
            action.update(context);
        }
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.setTarget(context.targets[this.name], context));
    }

    getAllLegalTargets(context) {
        return _.filter(context.game.rings, ring => this.properties.ringCondition(ring));
    }

    resolve(context, noCostsFirstButton = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: 'ring' };
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(this.properties.optional) {
            buttons.push({ text: 'No more targets', arg: 'noMoreTargets' });
        }
        if(context.stage === 'pretarget') {
            if(!noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            source: context.source,
            buttons: buttons,
            onSelect: (player, ring) => {
                result.resolved = true;
                result.value = ring;
                context.rings[this.name] = ring;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    result.costsFirst = true;
                    return true;
                }
                result.resolved = true;
                result.value = arg;
                return true;
            }
        };
        context.game.promptForRingSelect(player, _.extend(promptProperties, this.properties));
        return result;
    }
    
    checkTarget(context) {
        return this.properties.ringCondition(context.rings[this.name]);
    }
}

module.exports = AbilityTargetCard;
