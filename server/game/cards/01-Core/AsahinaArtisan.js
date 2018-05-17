const DrawCard = require('../../drawcard.js');

class AsahinaArtisan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +0/+3',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card !== context.source && card.isFaction('crane') && card.location === 'play area'
            },
            effect: 'give {0} +3{1} skill',
            effectArgs: () => 'political',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.modifyPoliticalSkill(3)
            })
        });
    }
}

AsahinaArtisan.id = 'asahina-artisan';

module.exports = AsahinaArtisan;
