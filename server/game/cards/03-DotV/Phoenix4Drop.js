const DrawCard = require('../../drawcard.js');

class Phoenix4Drop extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.cannotBeSentHome(context => context && context.source.controller === this.controller.opponent)
        });
        this.action({
            title: 'Change base skills to match another character\'s',
            condition: context => context.source.isDefending(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            handler: context => {
                let newMil = context.target.getMilitarySkill();
                let newPol = context.target.getPoliticalSkill();
                this.game.addMessage('{0} uses {1}, targeting {2} and changing {1}\'s base {3} skill to {4} and {5} skill to {6}', context.player, context.source, context.target, 'military', newMil, 'political', newPol);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effects: [
                        ability.effects.modifyBaseMilitarySkill(newMil - context.source.baseMilitarySkill),
                        ability.effects.modifyBasePoliticalSkill(newPol - context.source.basePoliticalSkill)
                    ]
                }));
            }
        });
    }
}

Phoenix4Drop.id = 'phoenix-4-drop'; // This is a guess at what the id might be - please check it!!!

module.exports = Phoenix4Drop;
