const DrawCard = require('../../drawcard.js');

class Duty extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) =>
                    event.player === context.player && event.amount <= -context.player.honor && event.context.stage === 'effect',
                onTransferHonor: (event, context) =>
                    event.player === context.player && event.amount >= context.player.honor && event.context.stage === 'effect'
            },
            effect: 'cancel their honor loss',
            handler: context => {
                context.cancel();
                this.game.openThenEventWindow(ability.actions.gainHonor().getEvent(context.player, context));
                this.game.addMessage('{0} gains an honor from {1}\'s resolution', context.player, context.source);
            }
        });
    }
}

Duty.id = 'duty'; // This is a guess at what the id might be - please check it!!!

module.exports = Duty;
