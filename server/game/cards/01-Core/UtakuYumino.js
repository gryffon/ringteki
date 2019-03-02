const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class UtakuYumino extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card for +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.discardCard({ location: Locations.Hand }),
            effect: 'give {0} +2/+2',
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            limit: ability.limit.perConflict(1)
        });
    }
}

UtakuYumino.id = 'utaku-yumino';

module.exports = UtakuYumino;
