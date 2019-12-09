const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class StrategicWeapoint extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Force opponent to discard a character',
            when: {
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            },
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to discard',
                controller: Players.Opponent,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}

StrategicWeapoint.id = 'strategic-weakpoint';

module.exports = StrategicWeapoint;
