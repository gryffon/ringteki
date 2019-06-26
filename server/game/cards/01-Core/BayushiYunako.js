const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class BayushiYunako extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s M and P skill',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

BayushiYunako.id = 'bayushi-yunako';

module.exports = BayushiYunako;
