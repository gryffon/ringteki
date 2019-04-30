const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes} = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class WarmWelcome extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a conflict card from discard',
            condition: context => context.player.opponent && context.player.showBid < context.player.opponent.showBid,
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playCard(context => ({ target: context.target })),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.target.type === CardTypes.Event ? context.target : [],
                        destination: Locations.ConflictDeck, bottom: true
                    }))
                ])
            }
        });
    }
}

WarmWelcome.id = 'warm-welcome';

module.exports = WarmWelcome;
