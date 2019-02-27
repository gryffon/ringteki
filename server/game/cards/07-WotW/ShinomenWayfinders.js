const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShinomenWayfinders extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: context => this.amountReduced(context),
                match: (card, source) => card === source
            })
        });
    }

    amountReduced(context) {
        return context.player.filterCardsInPlay(card => {
            return card.isParticipating() && card.isFaction('unicorn');
        }).length;
    }
}

ShinomenWayfinders.id = 'shinomen-wayfinders';

module.exports = ShinomenWayfinders;
