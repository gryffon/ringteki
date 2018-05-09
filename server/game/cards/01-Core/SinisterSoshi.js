const DrawCard = require('../../drawcard.js');

class SinisterSoshi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -2/-2',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            effect: 'give {0} -2{1}/-2{2}',
            effectArgs: () => ['military', 'political'],
            untilEndOfConflict: context => ({
                match: context.player,
                effect: [
                    ability.effects.modifyMilitarySkill(-2),
                    ability.effects.modifyPoliticalSkill(-2)
                ]
            })
        });
    }
}

SinisterSoshi.id = 'sinister-soshi';

module.exports = SinisterSoshi;
