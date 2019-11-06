const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class BladeOf10000Battles extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.reaction({
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                    event.conflict.winner === context.source.parent.controller &&
                                                    context.player.opponent &&
                                                    context.player.honor > context.player.opponent.honor
            },
            title: 'Add a card from the discard pile to the hand',
            target: {
                activePromptTitle: 'Choose a card from your conflict discard pile to add to your hand',
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}

BladeOf10000Battles.id = 'blade-of-10-000-battles';

module.exports = BladeOf10000Battles;
