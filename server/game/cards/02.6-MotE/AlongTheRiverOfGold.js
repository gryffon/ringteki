const ProvinceCard = require('../../provincecard.js');

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'switch a character\'s base skills',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince.getElement() === 'water',
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && !card.hasDash()
            },
            effect: 'switch {0}\'s military and political skill',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: [
                    ability.effects.modifyBaseMilitarySkill(context.target.basePoliticalSkill - context.target.baseMilitarySkill),
                    ability.effects.modifyBasePoliticalSkill(context.target.baseMilitarySkill - context.target.basePoliticalSkill)
                ]
            })
        });
    }
}

AlongTheRiverOfGold.id = 'along-the-river-of-gold';

module.exports = AlongTheRiverOfGold;
