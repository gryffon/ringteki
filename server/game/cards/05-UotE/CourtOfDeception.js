const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class CourtOfDeception extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a dishonored character\'s status token',
            condition: context => context.player.honor <= 6,
            target: {
                cardtype: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isDishonored && !card.isParticipating(),
                gameAction: ability.actions.discardStatusToken()
            }
        });
    }
}

CourtOfDeception.id = 'court-of-deception'; // This is a guess at what the id might be - please check it!!!

module.exports = CourtOfDeception;
