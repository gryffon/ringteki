const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Phases, Locations } = require('../../Constants');

class KyudenHida extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a Character',
            condition: context => context.player.dynastyDeck.size() > 0,
            phase: Phases.Dynasty,
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'look at the top three cards of their dynasty deck',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a character',
                    cards: context.player.dynastyDeck.first(3),
                    cardCondition: card => card.type === CardTypes.Character,
                    choices: ['Take nothing'],
                    handlers: [() => {
                        this.game.addMessage('{0} takes nothing', context.player);
                        return true;
                    }],
                    gameAction: AbilityDsl.actions.playCard({ resetOnCancel: true })
                })),
                AbilityDsl.actions.shuffleDeck(context => ({
                    deck: Locations.DynastyDeck,
                    target: context.player
                }))
            ])
        });
    }
}

KyudenHida.id = 'kyuden-hida';
module.exports = KyudenHida;

