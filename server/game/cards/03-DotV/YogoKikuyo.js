const DrawCard = require('../../drawcard.js');

class YogoKikuyo extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Cancel a spell',
            when: {
                onCardAbilityInitiated: (event) => {
                  let result = this.game.currentConflict && event.card.type === 'event' && event.card.hasTrait('spell')
                  console.log(result);
                  return result;
                }
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to put it into play and cancel the effects of {2}', this.controller, this, context.event.card);
                this.controller.putIntoPlay(this);
                context.cancel();
            }
        });
    }
}

YogoKikuyo.id = 'yogo-kikuyo';

module.exports = YogoKikuyo;
