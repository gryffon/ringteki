const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class MidnightRevels extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay(c => c.type === CardTypes.Character);
                    return card.getCost() === Math.max(...charactersInPlay.map(c => c.getCost()));
                },
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

MidnightRevels.id = 'midnight-revels';

module.exports = MidnightRevels;
