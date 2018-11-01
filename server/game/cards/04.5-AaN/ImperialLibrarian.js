const DrawCard = require('../../drawcard.js');

class ImperialLibrarian extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card !== context.source,
            targetController: 'any',
            effect: ability.effects.modifyGlory(1)
        });
    }
}

ImperialLibrarian.id = 'imperial-librarian';
module.exports = ImperialLibrarian;
