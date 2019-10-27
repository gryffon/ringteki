const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FrontlineEngineer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyGlory(this.getHoldingsInPlay())
        });

        this.action({
            title: 'Search top 5 card for a holding',
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                cards: context.player.dynastyDeck.first(5).filter(card => card.type === CardTypes.Holding),
                choices: ['Select nothing'],
                handlers: [() => this.game.addMessage('{0} selects nothing from their deck', context.player)],
                gameAction: AbilityDsl.actions.moveCard(context => ({
                    destination: this.game.currentConflict.conflictProvince.location,
                    message: '{1} chooses to place {2} in {0} discarding {3}',
                    messageArgs: (card, player, properties) => [this.game.currentConflict.conflictProvince.location, player, properties.target, player.getDynastyCardInProvince(card.location)]
                }))
            })),
            effect: 'choose a holding to place in the attacked province'
        });
    }

    getHoldingsInPlay() {
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
