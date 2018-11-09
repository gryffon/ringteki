const StrongholdCard = require('../../strongholdcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class KyudenIsawa extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a spell event from discard',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            effect: 'play a spell event from discard',
            gameAction: ability.actions.playCard(context => ({
                promptForSelect: {
                    activePromptTitle: 'Choose a spell event',
                    cardType: CardTypes.Event,
                    controller: Players.Self,
                    location: Locations.ConflictDiscardPile,
                    cardCondition: card => card.hasTrait('spell')
                },
                resetOnCancel: true,
                postHandler: card => {
                    context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                    context.player.moveCard(card, Locations.RemovedFromGame);
                }
            }))
        });
    }
}

KyudenIsawa.id = 'kyuden-isawa';

module.exports = KyudenIsawa;
