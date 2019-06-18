const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AdmitDefeat extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfParticipantsFor('defender') === 1,
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDefending(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

AdmitDefeat.id = 'admit-defeat';

module.exports = AdmitDefeat;
