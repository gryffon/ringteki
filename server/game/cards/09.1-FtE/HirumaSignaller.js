const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class HirumaSignaller extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice this card to ready and move a character to the conflict',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveToConflict()
                ])
            },
            effect: 'ready and move {0} to the conflict'
        });
    }
}

HirumaSignaller.id = 'hiruma-signaller';

module.exports = HirumaSignaller;

