const AbilityTargetCard = require('./AbilityTargetCard');
const { MenuPromptAction } = require('../GameActions/MenuPromptAction');
const { Stages } = require('../Constants.js');

class AbilityTargetAbility extends AbilityTargetCard {
    getTargetingGameAction(properties) {
    // @ts-ignore
    return new MenuPromptAction({
            activePromptTitle: 'Choose an ability',
            gameAction: super.getTargetingGameAction(properties)
        });
    }

    getTargetingActionPropFactory(properties) {
        return context => Object.assign(super.getTargetingActionPropFactory(properties)(context), {
            targets: !!this.properties.targets,
            subActionProperties: card => {
                console.log('subAction');
                const abilities = card.actions.concat(card.reactions).filter(ability => ability.isTriggeredAbility() && this.properties.abilityCondition(ability));
                return { choices: abilities.map(ability => ability.title) };
            }
        });
    }

    getCardCondition(properties, cardCondition) {
        return (card, context) => {
            let abilities = card.actions.concat(card.reactions).filter(ability => ability.isTriggeredAbility() && this.properties.abilityCondition(ability));
            console.log(abilities.map(ability => ability.title));
            return abilities.some(ability => {
                let contextCopy = context.copy();
                contextCopy.targetAbility = ability;
                if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                    return false;
                }
                return (!cardCondition || cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   properties.gameAction.hasLegalTarget(contextCopy);
            });
        };
    }

    getAdditionalProperties(context, targetResults, preTarget = false) {
        let props = super.getAdditionalProperties(context, targetResults, preTarget);
        return Object.assign(props, {
            targets: !!this.properties.targets,
            subActionProperties: card => {
                const abilities = card.actions.concat(card.reactions).filter(ability => ability.isTriggeredAbility() && this.properties.abilityCondition(ability));
                return {
                    choices: abilities.map(ability => ability.title).concat('Back'),
                    choiceHandler: choice => {
                        if(choice === 'Back') {
                            context.game.queueSimpleStep(() => this.resolve(context, targetResults));
                        } else {
                            context.targetAbility = abilities.find(ability => ability.title === choice);
                        }
                    }
                };
            }
        });
    }

    checkTarget(context) {
        if(!context.targetAbility || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.properties.cardType === context.targetAbility.card.type &&
               (!this.properties.cardCondition || this.properties.cardCondition(context.targetAbility.card, context)) &&
               this.properties.abilityCondition(context.targetAbility);
    }
}

module.exports = AbilityTargetAbility;
