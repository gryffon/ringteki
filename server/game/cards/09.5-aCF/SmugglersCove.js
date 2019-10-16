const ProvinceCard = require('../../provincecard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class SmugglersCove extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Moves a character to or from a conflict at this province',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.target.isParticipating(),
                    trueGameAction: AbilityDsl.actions.sendHome(),
                    falseGameAction: AbilityDsl.actions.moveToConflict()
                })
            }
        });
    }
}

SmugglersCove.id = 'smuggler-s-cove';

module.exports = SmugglersCove;
