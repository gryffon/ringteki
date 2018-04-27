const DrawCard = require('../../drawcard.js');

class AsahinaArtisan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +3P',
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => this.game.currentConflict && card !== context.source && 
                                                  card.isFaction('crane') && card.location === 'play area'
            },
            effect: 'give {0} +3 {1} skill',
            effectItems: () => 'political',
            untilEndOfConflict: {
                effect: ability.effects.modifyPoliticalSkill(3)
            }
        });
    }
}

AsahinaArtisan.id = 'asahina-artisan';

module.exports = AsahinaArtisan;
