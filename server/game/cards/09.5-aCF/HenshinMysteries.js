const ProvinceCard = require('../../provincecard.js');
const EventRegistrar = require('../../eventregistrar.js');

class HenshinMysteries extends ProvinceCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            'onClaimRing:OtherEffects': 'cancelRingClaim'
        }]);
    }

    cancelRingClaim(event) {
        if(!this.isBroken && !this.isBlank() && event.conflict && event.conflict.conflictProvince === this && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring being claimed', this);
        }
    }
}

HenshinMysteries.id = 'henshin-mysteries';

module.exports = HenshinMysteries;
