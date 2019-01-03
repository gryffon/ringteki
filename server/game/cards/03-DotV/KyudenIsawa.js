const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants');

class KyudenIsawa extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a spell event from discard',
            cost: AbilityDsl.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            effect: 'play a spell event from discard',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose a spell event',
                cardType: CardTypes.Event,
                controller: Players.Self,
                location: Locations.ConflictDiscardPile,
                cardCondition: card => card.hasTrait('spell'),
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    postHandler: card => {
                        context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                        context.player.moveCard(card, Locations.RemovedFromGame);
                    }
                })
            }))
        });
    }
}

KyudenIsawa.id = 'kyuden-isawa';

module.exports = KyudenIsawa;
