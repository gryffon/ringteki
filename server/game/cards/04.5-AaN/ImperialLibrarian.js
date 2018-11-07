const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class ImperialLibrarian extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.modifyGlory(1)
        });
    }
}

ImperialLibrarian.id = 'imperial-librarian';
module.exports = ImperialLibrarian;
