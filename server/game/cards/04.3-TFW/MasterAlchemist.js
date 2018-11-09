const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class MasterAlchemist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character',
            cost: ability.costs.payFateToRing(1, ring => ring.element === 'fire'),
            condition: () => this.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardTypes.Character,
                gameAction: ability.actions.fireRingEffect()
            }
        });
    }
}

MasterAlchemist.id = 'master-alchemist';

module.exports = MasterAlchemist;
