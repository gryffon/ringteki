const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players } = require('../../Constants');

class IwasakiPupil extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: AbilityDsl.effects.modifyCardsDrawnInDrawPhase(-2)
        });
    }
}

IwasakiPupil.id = 'iwasaki-pupil';

module.exports = IwasakiPupil;
