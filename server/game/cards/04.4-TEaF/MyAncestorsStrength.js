const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class MyAncestorsStrength extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Modify base military and political skills',
            condition: () => this.game.isDuringConflict(),
            targets: {
                shugenja: {
                    activePromptTitle: 'Choose a shugenja character',
                    cardType: 'character',
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('shugenja') && card.isParticipating()
                },
                ancestor: {
                    dependsOn: 'shugenja',
                    activePromptTitle: 'Choose a character to copy from',
                    cardType: 'character',
                    location: Locations.DynastyDiscardPile,
                    controller: Players.Self,
                    gameAction: ability.actions.cardLastingEffect(context => {
                        let effects = [];
                        let ancestor = context.targets.ancestor;
                        if(ancestor.hasDash('military')) {
                            effects.push(ability.effects.setDash('military'));
                        } else {
                            effects.push(ability.effects.setBaseMilitarySkill(ancestor.militarySkill));
                        }
                        if(ancestor.hasDash('political')) {
                            effects.push(ability.effects.setDash('political'));
                        } else {
                            effects.push(ability.effects.setBasePoliticalSkill(ancestor.politicalSkill));
                        }
                        return {
                            target: context.targets.shugenja,
                            effect: effects
                        };
                    })
                }
            },
            effect: 'set {1}\'s base skills to those of {2}',
            effectArgs: context => [context.targets.shugenja, context.targets.ancestor]
        });
    }
}

MyAncestorsStrength.id = 'my-ancestor-s-strength';

module.exports = MyAncestorsStrength;
