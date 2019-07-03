const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'switch a character\'s base skills',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince.getElement() === 'water',
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
