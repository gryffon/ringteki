const DrawCard = require('../../drawcard.js');

class DisplayOfPower extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Cancel opponent\'s ring effect and claim and resolve the ring',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            effect: 'resolve and claim the ring when the ring effect resolves',
            handler: context => this.game.once('onResolveRingEffect:cancelinterrupt', event => this.onResolveRingEffect(event, context))
        });
    }
    
    onResolveRingEffect(event, context) {
        this.game.addMessage('{0} cancels the ring effect and {1} may resolve it and then claims it', context.source, context.player);
        let ring = this.game.currentConflict.ring;
        event.window.addEvent(this.game.getEvent('onResolveRingEffect', { 
            player: context.player, 
            conflict: event.conflict, 
            order: -1 
        }, () => event.conflict.resolveRing(context.player)));
        event.window.addEvent(this.game.getEvent('onClaimRing', { player: this.controller, conflict: event.conflict }, () => ring.claimRing(context.player)));
        event.cancel();
    }
}

DisplayOfPower.id = 'display-of-power';

module.exports = DisplayOfPower;

