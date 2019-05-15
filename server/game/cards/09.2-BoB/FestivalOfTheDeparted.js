const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class FestivalOfTheDeparted extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            match: card => card.type === CardTypes.Character,
            effect: AbilityDsl.effects.cannotApplyLastingEffects(effect =>
                effect.source.type === CardTypes.Event && effect.effect.isSkillModifier() && effect.effect.getValue > 0)
        });
    }
}

FestivalOfTheDeparted.id = 'festival-of-the-departed';

module.exports = FestivalOfTheDeparted;
