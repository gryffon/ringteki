const DrawCard = require('../../drawcard.js');
const { CardTypes, ConflictTypes, Players } = require('../../Constants');

class APerfectCut extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(ConflictTypes.Military),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'grant 2 military skill to {0}',
            then: context => ({
                gameAction: ability.actions.delayedEffect({
                    target: context.target,
                    when: {
                        afterConflict: event =>
                            context.target.isParticipating() &&
                            context.target.controller === event.conflict.winner &&
                            context.target.allowGameAction('honor')
                    },
                    gameAction: ability.actions.honor()
                })
            })
        });
    }
}

APerfectCut.id = 'a-perfect-cut';

module.exports = APerfectCut;
