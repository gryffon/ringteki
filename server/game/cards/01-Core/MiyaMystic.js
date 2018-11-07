const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');

class MiyaMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to discard an attachment',
            cost: ability.costs.sacrificeSelf(),
            phase: Phases.Conflict,
            target: {
                cardType: 'attachment',
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

MiyaMystic.id = 'miya-mystic';

module.exports = MiyaMystic;


