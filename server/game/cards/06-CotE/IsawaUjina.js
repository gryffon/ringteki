const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IsawaUjina extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Remove a character from the game',
            when: {
                onClaimRing: (event) => event.conflict && event.conflict.ring.hasElement('void')
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.fate === 0,
                gameAction: AbilityDsl.actions.removeFromGame()
            },
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

}

IsawaUjina.id = 'isawa-ujina';

module.exports = IsawaUjina;
