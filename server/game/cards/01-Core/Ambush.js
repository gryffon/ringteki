const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class Ambush extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            target: {
                activePromptTitle: 'Choose up to two characters',
                numCards: 2,
                mode: TargetModes.MaxStat,
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                cardType: CardTypes.Character,
                location: [Locations.Hand, Locations.Provinces],
                controller: Players.Self,
                cardCondition: card => card.isFaction('scorpion'),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
