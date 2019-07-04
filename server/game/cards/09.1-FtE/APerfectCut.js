const DrawCard = require('../../drawcard.js');
const { CardTypes, ConflictTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class APerfectCut extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(ConflictTypes.Military),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })),
                    AbilityDsl.actions.delayedEffect((context) => ({
                        when: {
                            afterConflict: event =>
                                context.target.isParticipating() &&
                                context.target.controller === event.conflict.winner
                        },
                        gameAction: AbilityDsl.actions.honor(),
                        message: '{1} is honored due to the delayed effect of {0}',
                        messageArgs: [context.source]
                    }))
                ])
            },
            effect: 'grant +2{1} to {0} and honor them, if they win the current conflict',
            effectArgs: ['military']
        });
    }
}

APerfectCut.id = 'a-perfect-cut';

module.exports = APerfectCut;
