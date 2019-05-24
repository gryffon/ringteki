const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WarDogMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source)
            },
            cost: ability.costs.discardCardSpecific(context => context.player.dynastyDeck.first()),
            effect: 'give {0} +{1}{2}',
            effectArgs: context => [_.isNumber(context.costs.discardCard[0].getCost()) ? context.costs.discardCard[0].getCost() : 0, 'military'],
            handler: context => ability.actions.cardLastingEffect({
                effect: ability.effects.modifyMilitarySkill(
                    _.isNumber(context.costs.discardCard[0].getCost()) ? context.costs.discardCard[0].getCost() : 0
                )
            }).resolve(context.source, context)
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
