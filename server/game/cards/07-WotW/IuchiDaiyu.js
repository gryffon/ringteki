const DrawCard = require('../../drawcard.js');

class IuchiDaiyu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: '+1 military for each faceup province',
            condition: () => this.game.isDuringConflict(),
            target: {
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyMilitarySkill(context.player.getNumberOfOpponentsFaceupProvinces())
                }))
            },
            effect: 'give {0} +1{1} for each faceup non-stronghold province their opponent controls',
            effectArgs: () => ['military']
        });
    }
}

IuchiDaiyu.id = 'iuchi-daiyu';

module.exports = IuchiDaiyu;
