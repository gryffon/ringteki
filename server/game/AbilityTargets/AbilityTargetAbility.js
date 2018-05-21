class AbilityTargetAbility {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return this.getAllLegalTargets(context).length > 0;
    }

    getAllLegalTargets(context) {
        return context.game.findAnyCardsInPlay(card => this.properties.cardCondition(card, context) && 
                                                       card.abilities.actions.concat(card.abilities.reactions).some(ability => ability.printedAbility));
    }

    updateGameActions() {
        return;
    }

    resolve(context) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: this.properties.mode };
        if(this.getAllLegalTargets(context).length === 0) {
            result.resolved = true;
            return result;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(context.stage === 'pretarget') {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            onSelect: (player, card) => {
                result.resolved = true;
                let ability = card.abilities.actions.find(action => action.printedAbility) || card.abilities.reactions.find(reaction => reaction.printedAbility);
                result.value = ability;
                context.targetAbility = ability;
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
                } else if(arg === 'cancel') {
                    result.resolved = true;
                    return true;
                }
                result.resolved = true;
                result.value = arg;
                return true;
            }
        };
        context.game.promptForSelect(context.player, Object.assign(promptProperties, this.properties));
        return result;
    }
    
    checkTarget(context) {
        if(!context.targetAbility) {
            return false;
        }
        return this.properties.cardType === context.targetAbility.card.type && 
               this.properties.cardCondition(context.targetAbility.card, context);
    }
}

module.exports = AbilityTargetAbility;
