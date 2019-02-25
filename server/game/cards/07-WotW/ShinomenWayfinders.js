const DrawCard = require('../../drawcard.js');
const { Locations, Players, PlayTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShinomenWayfinders extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.PlayArea,
            targetController: Players.Self,
            effect: AbilityDsl.effects.reduceCost({
                playingTypes: PlayTypes.PlayFromHand,
                amount: context => {
                    return context.player.filterCardsInPlay(card => {
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
