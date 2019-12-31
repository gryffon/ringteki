const DrawCard = require('../../drawcard.js');
const { Locations, Durations, Players, AbilityTypes, CardTypes } = require('../../Constants');

class IllustriousPlagiarist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: context => context.player.opponent && context.player.opponent.conflictDiscardPile.filter(card => card.type === CardTypes.Event).every(card => card.abilities.actions.length > 0),
            target: {
                player: Players.Opponent, // As per December 2019 RRG Conflict Discard Pile order is determined by the controller of the pile
                location: Locations.ConflictDiscardPile,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.location === Locations.ConflictDiscardPile &&
                    card.type === CardTypes.Event &&
                    card.controller === context.player.opponent &&
                    card.abilities.actions.length > 0,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    target: context.source,
                    effect: context.target.abilities.actions.map(action => ability.effects.gainAbility(AbilityTypes.Action, action))
                }))
            },
            effect: 'copy {0}\'s action abilities'
        });
    }
}

IllustriousPlagiarist.id = 'illustrious-plagiarist';

module.exports = IllustriousPlagiarist;
