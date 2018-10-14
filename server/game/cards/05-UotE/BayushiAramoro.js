const DrawCard = require('../../drawcard.js');

class BayushiAramoro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -2/-0',
            cost: ability.costs.dishonorSelf(),
            condition: context => context.source.isParticipating() && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: [
                        ability.effects.modifyMilitarySkill(-2),
                        ability.effects.terminalCondition({
                            condition: () => context.target.getMilitarySkill() < 1,
                            message: '{1} is discarded due to {0}\'s lasting effect',
                            gameAction: ability.actions.discardFromPlay()
                        })
                    ]
                }))
            },
            effect: 'reduce {0}\'s military skill by 2 - they will die if they reach 0'
        });
    }
}

BayushiAramoro.id = 'bayushi-aramoro';

module.exports = BayushiAramoro;
