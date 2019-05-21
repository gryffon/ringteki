const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players } = require('../../Constants');

class FestivalOfTheDeparted extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            match: card => card.type === CardTypes.Character,
            targetController: Players.Any,
            effect: AbilityDsl.effects.cannotApplyLastingEffects(effect =>
                effect.context.source.type === CardTypes.Event && effect.isSkillModifier() && effect.getValue() > 0
            )
        });
    }
}

FestivalOfTheDeparted.id = 'festival-of-the-departed';

module.exports = FestivalOfTheDeparted;
