const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class HanteiSotorii extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a participating character +3 glory',
            condition: context => context.source.isParticipating() && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyGlory(3)
                }))
            },
            effect: 'give {0} +3 glory until the end of the conflict'
        });
    }
}

HanteiSotorii.id = 'hantei-sotorii';
module.exports = HanteiSotorii;
