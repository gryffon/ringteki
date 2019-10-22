const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KitsukiKagi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove cards from the game',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating()
            },
            targets: {
                first: {
                    activePromptTitle: 'Choose up to 3 cards',
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    player: Players.Any,
                    gameAction: AbilityDsl.actions.removeFromGame({
                        location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile]
                    })
                },
                second: {
                    activePromptTitle: 'Choose a cards',
                    dependsOn: 'first',
                    optional: true,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    player: Players.Any,
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first,
                    gameAction: AbilityDsl.actions.removeFromGame({
                        location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile]
                    })
                },
                third: {
                    activePromptTitle: 'Choose a card',
                    dependsOn: 'second',
                    optional: true,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    player: Players.Any,
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first &&
                        card !== context.targets.second,
                    gameAction: AbilityDsl.actions.removeFromGame({
                        location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile]
                    })
                }
            }
        });
    }
}

KitsukiKagi.id = 'kitsuki-kagi';

module.exports = KitsukiKagi;
