const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class DisplayOfPower extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Cancel opponent\'s ring effect and claim and resolve the ring',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictUnopposed
            },
            handler: () => {
                this.eventRegistrar = new EventRegistrar(this.game, this);
                this.eventRegistrar.register([{ 'onResolveRingEffect:cancelinterrupt': 'displayOfPowerOnResolveRingEffect' }]);
                this.game.addMessage('{0} uses {1} at {2}', this.controller, this, this.game.currentConflict.conflictProvince);
            }
        });
    }
    
    displayOfPowerOnResolveRingEffect(event) {
        this.eventRegistrar.unregisterAll();
        this.game.queueSimpleStep(() => this.displayOfPowerCancelRingEffect(event));
    }

    displayOfPowerCancelRingEffect(event) {
        if(event.player !== this.controller) {
            if(event.cancelled) {
                this.game.addMessage('{0} attempts to cancel the ring effect, but it has already been cancelled', this);
                return;
            }
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect and {1} may resolve it and then claims it', this, this.controller);
            let ring = this.game.currentConflict.ring;
            let resolveEvent = this.game.getEvent('onResolveRingEffect', { 
                player: this.controller, 
                conflict: event.conflict, 
                order: -1 
            }, () => event.conflict.resolveRing(this.controller));
            let claimEvent = this.game.getEvent('onClaimRing', { player: this.controller, conflict: event.conflict }, () => ring.claimRing(this.controller));
            this.game.openEventWindow([resolveEvent, claimEvent]);
        }
    }
}

DisplayOfPower.id = 'display-of-power';

module.exports = DisplayOfPower;

