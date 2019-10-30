const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FrontlineEngineer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyGlory(card => this.getHoldingsInPlay(card))
        });

        this.action({
            title: 'Place a holding from your deck faceup in the defending province',
            condition: context => context.player.dynastyDeck.size() > 0 && context.player.isDefendingPlayer(),
            effect: 'look at the top five cards of their dynasty deck',
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a holding',
                context: context,
                cardCondition: card => card.getType() === CardTypes.Holding,
                cards: context.player.dynastyDeck.first(5),
                cardHandler: cardFromDeck => {
                    let card = context.player.getDynastyCardInProvince(this.game.currentConflict.conflictProvince.location)
                    this.game.addMessage('{0} discards {1}, replacing it with {2}', context.player, card, cardFromDeck);
                    context.player.moveCard(cardFromDeck, this.game.currentConflict.conflictProvince.location);
                    cardFromDeck.facedown = false;
                    context.player.moveCard(card, Locations.DynastyDiscardPile);
                    context.player.shuffleDynastyDeck();
                }
            })
        });
    }

    getHoldingsInPlay(source) {
        return this.game.allCards.reduce((sum, card) => {
            if(!card.facedown && (card.isInProvince() && card.type === CardTypes.Holding)) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}

FrontlineEngineer.id = 'frontline-engineer';

module.exports = FrontlineEngineer;
