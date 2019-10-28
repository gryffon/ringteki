const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class UnspokenEtiquette extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor each participating non-courtier',
            effect: 'dishonor each participating non-courtier.',
            condition: context => context.game.isDuringConflict('political'),
            gameAction: AbilityDsl.actions.dishonor(context => ({
                target: context.game.currentConflict.getParticipants(card => !card.hasTrait('courtier'))
            }))
        });
    }
}

UnspokenEtiquette.id = 'unspoken-etiquette';

module.exports = UnspokenEtiquette;

