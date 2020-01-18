const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');

class FrostbittenCrossing extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard all attachments from a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0
            },
            effect: 'remove all attachments from {0}',
            gameAction: ability.actions.discardFromPlay(context => ({ target: context.target.attachments.toArray() }))
        });
    }
}

FrostbittenCrossing.id = 'frostbitten-crossing';

module.exports = FrostbittenCrossing;
