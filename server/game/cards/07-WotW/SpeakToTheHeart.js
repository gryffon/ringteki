const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class SpeakToTheHeart extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'give +1 political to a character for each faceup province',
            condition: () => this.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardCondition: card => card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince))
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls (+{2}{1})',
            effectArgs: context => ['political', context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince)]
        });
    }
}

SpeakToTheHeart.id = 'speak-to-the-heart';

module.exports = SpeakToTheHeart;
