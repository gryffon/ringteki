const DrawCard = require('../../drawcard.js');

class ContingencyPlan extends DrawCard {
    setupCardAbilities() {
        // TODO modfyHonorBid game action?
        this.reaction({
            title: 'Change your bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            effect: 'change their honor bid',
            handler: context => {
                if(context.player.honorBid > 0) {
                    this.game.promptWithHandlerMenu(context.player, {
                        context: context,
                        choices: ['Increase your bid', 'Decrease your bid'],
                        handlers: [
                            () => {
                                this.game.addMessage('{0} increases their bid by 1', context.player);
                                context.player.honorBid++;
                            },
                            () => {
                                this.game.addMessage('{0} decreases their bid by 1', context.player);
                                context.player.honorBid--;
                            }
                        ]
                    });
                } else {
                    this.game.addMessage('{0} increases their bid by 1', context.player);
                    context.player.honorBid++;
                }
            }
        });
    }
}

ContingencyPlan.id = 'contingency-plan';

module.exports = ContingencyPlan;
