const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Dispatch extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context, properties) => properties.target[0].inConflict,
                    trueGameAction: AbilityDsl.actions.sendHome(),
                    falseGameAction: AbilityDsl.actions.moveToConflict()
                })
            })
        });
    }
}

Dispatch.id = 'dispatch';

module.exports = Dispatch;
