const ProvinceCard = require('../../provincecard.js');
const EventRegistrar = require('../../eventregistrar.js');

class Pilgrimage extends ProvinceCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            'onResolveConflictRing:OtherEffects': 'cancelRingEffect',
            'onResolveRingElement:cancelinterrupt': 'cancelRingEffect'
        }]);
    }

    cancelRingEffect(event) {
        if(!this.isBroken && !this.isBlank() && event.conflict && event.conflict.conflictProvince === this && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}

Pilgrimage.id = 'pilgrimage';

module.exports = Pilgrimage;
