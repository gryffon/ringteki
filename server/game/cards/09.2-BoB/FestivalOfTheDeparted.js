const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players } = require('../../Constants');

class FestivalOfTheDeparted extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            match: card => card.type === CardTypes.Character,
            targetController: Players.Any,
            effect: AbilityDsl.effects.cannotHaveSkillsModified(modifier =>
                modifier.type === CardTypes.Event && modifier.amount > 0
            )
        });
    }
}

FestivalOfTheDeparted.id = 'festival-of-the-departed';

module.exports = FestivalOfTheDeparted;
