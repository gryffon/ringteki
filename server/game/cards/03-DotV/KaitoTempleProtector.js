const DrawCard = require('../../drawcard.js');

class KaitoTempleProtector extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.cardCannot('sendHome', context => context.source.controller === this.controller.opponent)
        });
        this.action({
            title: 'Change base skills to match another character\'s',
            condition: context => context.source.isDefending(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            },
            handler: context => {
                let newMil = context.target.getMilitarySkill();
                if(context.target.hasDash('military')) {
                    newMil = '-';
                }
                let newPol = context.target.getPoliticalSkill();
                if(context.target.hasDash('political')) {
                    newPol = '-';
                }
                this.game.addMessage('{0} uses {1}, targeting {2} and changing {1}\'s base {3} skill to {4} and {5} skill to {6}', context.player, context.source, context.target, 'military', newMil, 'political', newPol);
                if(newMil === '-') {
                    context.source.untilEndOfConflict(ability => ({
                        match: context.source,
                        effect: ability.effects.setDash('military')
                    }));
                } else {
                    context.source.untilEndOfConflict(ability => ({
                        match: context.source,
                        effect: ability.effects.modifyBaseMilitarySkill(newMil - context.source.getbaseMilitarySkill())
                    }));                    
                }
                if(newPol === '-') {
                    context.source.untilEndOfConflict(ability => ({
                        match: context.source,
                        effect: ability.effects.setDash('political')
                    }));
                } else {
                    context.source.untilEndOfConflict(ability => ({
                        match: context.source,
                        effect: ability.effects.modifyBasePoliticalSkill(newMil - context.source.getbasePoliticalSkill())
                    }));
                }
            }
        });
    }
}

KaitoTempleProtector.id = 'kaito-temple-protector';

module.exports = KaitoTempleProtector;
