const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ShinjoHaruko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a honored character into the conflict',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isHonored,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

ShinjoHaruko.id = 'shinjo-haruko';
module.exports = ShinjoHaruko;

