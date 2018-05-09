const DrawCard = require('../../drawcard.js');

class IllustriousPlagiarist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: context => context.player.opponent,
            target: {
                cardCondition: (card, context) => card === context.player.opponent.conflictDiscardPile.find(card => card.type === 'event') && card.abilities.actions.length > 0
            },
            effect: 'copy {0}\'s action abilities',
            handler: context => {
                for(const action of context.target.abilities.actions) {
                    // We need to keep the old abilityIdentifier
                    let newProps = { printedAbility: false, abilityIdentifier: action.abilityIdentifier };
                    // If the copied ability has a max, we need to create a new instantiation of it, with the same max and reset event
                    if(action.properties.max) {
                        newProps.max = ability.limit.repeatable(action.properties.max.max, action.properties.max.eventName);
                    }
                    context.source.untilEndOfPhase(ability => ({
                        match: context.source,
                        effect: ability.effects.gainAbility('action', Object.assign({}, action.properties, newProps))
                    }));
                }
            }
        });
    }
}

IllustriousPlagiarist.id = 'illustrious-plagiarist';

module.exports = IllustriousPlagiarist;
