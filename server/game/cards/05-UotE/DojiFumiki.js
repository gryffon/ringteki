const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class DojiFumiki extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a dishonored character',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDishonored && card.isParticipating(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

DojiFumiki.id = 'doji-fumiki'; // This is a guess at what the id might be - please check it!!!

module.exports = DojiFumiki;
