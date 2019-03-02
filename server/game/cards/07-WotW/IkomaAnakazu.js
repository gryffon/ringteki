const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const AbilityDsl = require('../../abilitydsl');
const { EventNames } = require('../../Constants');

class IkomaAnakazu extends DrawCard {
    setupCardAbilities() {
        this.opponentBrokenProvinceThisPhase = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnBreakProvince, EventNames.OnPhaseEnded]);

        this.persistentEffect({
            condition: context => context.source.isParticipating() && this.opponentBrokenProvinceThisPhase,
            effect: AbilityDsl.effects.modifyBothSkills(3)
        });
    }

    onPhaseEnded() {
        this.opponentBrokenProvinceThisPhase = false;
    }

    onBreakProvince(event) {
        if(event.conflict && event.conflict.attackingPlayer !== this.controller) {
            this.opponentBrokenProvinceThisPhase = true;
        }
    }
}

IkomaAnakazu.id = 'ikoma-anakazu';

module.exports = IkomaAnakazu;
