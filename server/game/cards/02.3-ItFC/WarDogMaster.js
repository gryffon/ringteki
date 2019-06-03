const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class WarDogMaster extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source)
            },
            cost: AbilityDsl.costs.discardCardSpecific(context => context.player.dynastyDeck.first()),
            effect: 'give {0} +{1}{2}',
            effectArgs: context => [context.costs.discardCard && _.isNumber(context.costs.discardCard[0].getCost()) ? context.costs.discardCard[0].getCost() : 0, 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(
                    context.costs.discardCard && _.isNumber(context.costs.discardCard[0].getCost()) ? context.costs.discardCard[0].getCost() : 0
                )
            }))
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
