const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShinomenWayfinders extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.filterCardsInPlay(card => {
                        return card.isParticipating() && card.isFaction('unicorn');
                    }).length;
                },
                match: (card, source) => card === source
            })
        });
    }
}

ShinomenWayfinders.id = 'shinomen-wayfinders';

module.exports = ShinomenWayfinders;
