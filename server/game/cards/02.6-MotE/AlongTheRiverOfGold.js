const ProvinceCard = require('../../provincecard.js');

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'During water Province chose a participating caracter, switch character base skils until turn',
            condition: () => this.game.currentConflict.conflictProvince.getElement() === 'water',
            target:{
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.cardData.military !== undefined && card.cardData.political !== undefined

            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to switch {2}\'s military and political skill', this.controller, this, context.target);
                let diff = context.target.baseMilitarySkill - context.target.basePoliticalSkill;
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyBaseMilitarySkill(-diff),
                        ability.effects.modifyBasePoliticalSkill(diff)
                    ]
                }));
            }
        });
    }

}

AlongTheRiverOfGold.id = 'along-the-river-of-gold'; // This is a guess at what the id might be - please check it!!!

module.exports = AlongTheRiverOfGold;
