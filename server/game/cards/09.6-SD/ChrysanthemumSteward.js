const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ChrysanthemumSteward extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'put a conflict card on top',
            condition: context => context.source.isParticipating(),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Opponent
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                target: context.target,
                destination: Locations.ConflictDeck
            }))
        });
    }
}

ChrysanthemumSteward.id = 'chrysanthemum-steward';

module.exports = ChrysanthemumSteward;
