const DrawCard = require('../../drawcard.js');

class SupernaturalStorm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('shugenja')),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            effect: 'imbue {0} with the supernatural power of the storm!',
            handler: context => {
                let numOfShugenja = context.player.cardsInPlay.reduce((total, card) => total + card.hasTrait('shugenja') ? 1 : 0, 0);
                this.game.addMessage('{0} gains +{1}{2}/+{1}{3}', context.target, numOfShugenja, 'military', 'political');
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(numOfShugenja),
                        ability.effects.modifyPoliticalSkill(numOfShugenja)
                    ]
                }));
            }
        });
    }
}

SupernaturalStorm.id = 'supernatural-storm';

module.exports = SupernaturalStorm;
