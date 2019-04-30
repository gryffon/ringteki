const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IwasakiPupil extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyCardsDrawnInDrawPhase(-2)
        });
    }
}

IwasakiPupil.id = 'iwasaki-pupil';

module.exports = IwasakiPupil;
