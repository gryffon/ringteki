const DrawCard = require('../../drawcard.js');

class ContingencyPlan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Change your bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                source: context.source,
                choices: ['Increase your bid', 'Decrease your bid'],
                handlers: [
                    () => {
                        this.game.addMessage('{0} uses {1} to increase their bid by 1', context.player, this);
                        context.player.honorBid++;
                    },
                    () => {
                        this.game.addMessage('{0} uses {1} to decrease their bid by 1', context.player, this);
                        context.player.honorBid--;
                    }
                ]
            })
        });
    }
}

ContingencyPlan.id = 'contingency-plan';

module.exports = ContingencyPlan;
