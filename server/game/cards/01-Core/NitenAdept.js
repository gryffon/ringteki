const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class NitenAdept extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow character',
            condition: context => context.source.attachments.size() > 0 && context.source.isParticipating(),
            cost: ability.costs.bow((card, context) => card.getType() === CardTypes.Attachment && card.parent === context.source),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.attachments.size() === 0,
                gameAction: ability.actions.bow()
            }
        });
    }
}

NitenAdept.id = 'niten-adept';

module.exports = NitenAdept;
