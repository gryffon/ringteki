const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FanOfCommand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            condition: context => context.source.parent.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

FanOfCommand.id = 'fan-of-command';

module.exports = FanOfCommand;
