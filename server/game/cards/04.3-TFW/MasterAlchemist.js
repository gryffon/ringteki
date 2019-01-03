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
                gameAction: ability.actions.chooseAction({
                    messages: {
                        'Honor this character': '{0} chooses to honor {1}',
                        'Dishonor this character': '{0} chooses to honor {1}'
                    },
                    choices: {
                        'Honor this character': ability.actions.honor(),
                        'Dishonor this character': ability.actions.dishonor()
                    }
                })
            }
        });
    }
}

MasterAlchemist.id = 'master-alchemist';

module.exports = MasterAlchemist;
