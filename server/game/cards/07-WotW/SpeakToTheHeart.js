const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SpeakToTheHeart extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'give +1 political to a character for each faceup province',
            condition: () => this.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardCondition: card => card.isFaction('unicorn'),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces())
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls',
            effectArgs: () => ['political']
        });
    }
}

SpeakToTheHeart.id = 'speak-to-the-heart';

module.exports = SpeakToTheHeart;
