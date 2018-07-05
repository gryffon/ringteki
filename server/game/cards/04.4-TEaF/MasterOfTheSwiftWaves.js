const DrawCard = require('../../drawcard.js');

class MasterOfTheSwiftWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title:'Switch 2 characters you control',
            condition: () => this.game.isDuringConflict(),
            targets: {
                conflict: {
                    activePromptTitle: 'Choose a participating character',
                    cardType: 'character',
                    cardCondition: (card,context) => card.isParticipating() && card.controller === context.player
                },
                home: {
                    activePromptTitle: 'Choose a character at home',
                    cardType: 'character',
                    cardCondition: (card,context) => !card.isParticipating() && card.controller === context.player && !card.hasDash(this.game.currentConflict.conflictType),
                    gameAction: context => [ability.actions.sendHome(context.targets.conflict), ability.actions.moveToConflict(context.targets.home)]
                }
            },
            effect: 'switch {1} and {2} positions',
            effectArgs: context => [context.targets.conflict, context.targets.home]
        });
    }
}

MasterOfTheSwiftWaves.id = 'master-of-the-swift-waves';

module.exports = MasterOfTheSwiftWaves;
