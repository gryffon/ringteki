const AbilityTargetCard = require('./AbilityTargetCard');
const { MenuPromptAction } = require('../GameActions/MenuPromptAction');
const { Stages } = require('../Constants.js');

class AbilityTargetAbility extends AbilityTargetCard {
    getTargetingGameAction(properties) {
        return new MenuPromptAction({
            activePromptTitle: 'Choose an ability',
            choices: [],
            choiceHandler: () => ({}),
            gameAction: super.getTargetingGameAction(properties)
        });
    }

    getCardCondition(properties, cardCondition) {
        return (card, context) => {
            let abilities = card.actions.concat(card.reactions).filter(ability => ability.isTriggeredAbility() && this.properties.abilityCondition(ability));
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
                if(abilities.length === 1) {
                    context.targetAbility = abilities[0];
                } else if(abilities.length > 1) {
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
                return {};
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
