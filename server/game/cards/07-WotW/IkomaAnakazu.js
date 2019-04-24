const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const AbilityDsl = require('../../abilitydsl');
const { EventNames } = require('../../Constants');

class IkomaAnakazu extends DrawCard {
    setupCardAbilities() {
        this.brokenProvincesThisPhase = {};
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnBreakProvince, EventNames.OnPhaseEnded]);

        this.persistentEffect({
            condition: context => context.source.isParticipating() && context.source.controller.opponent && this.brokenProvincesThisPhase[context.source.controller.opponent.name] > 0,
            effect: AbilityDsl.effects.modifyBothSkills(3)
        });
    }

    onPhaseEnded() {
        this.brokenProvincesThisPhase = {};
    }

    onBreakProvince(event) {
        if(event.conflict && event.conflict.attackingPlayer) {
            if(this.brokenProvincesThisPhase[event.conflict.attackingPlayer.name]) {
                this.brokenProvincesThisPhase[event.conflict.attackingPlayer.name] += 1;
            } else {
                this.brokenProvincesThisPhase[event.conflict.attackingPlayer.name] = 1;
            }
        }
    }
}

IkomaAnakazu.id = 'ikoma-anakazu';

module.exports = IkomaAnakazu;
