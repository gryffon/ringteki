const DrawCard = require('../../drawcard.js');

class DisdainfulRemark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Province Strength',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')) && 
                                  context.player.opponent && context.player.opponent.hand.size() > 0,
            effect: 'add {1} to the province strength',
            effectArgs: context => context.player.opponent.size(),
            untilEndOfConflict: context => ({
                match: this.game.currentConflict.conflictProvince,
                targetLocation: 'province',
                effect: ability.effects.modifyProvinceStrength(context.player.opponent.size())
            })
        });
    }
}

DisdainfulRemark.id = 'disdainful-remark';

module.exports = DisdainfulRemark;
