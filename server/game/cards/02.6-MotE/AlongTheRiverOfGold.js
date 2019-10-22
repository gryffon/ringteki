const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'switch a character\'s base skills',
            conflictProvinceCondition: province => province.isElement(Elements.Water),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

AlongTheRiverOfGold.id = 'along-the-river-of-gold';

module.exports = AlongTheRiverOfGold;
