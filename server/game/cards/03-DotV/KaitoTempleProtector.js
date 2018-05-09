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
            effect: 'change his base skills to equal {0}\'s current skills', 
            handler: context => {
                let newMil = context.target.getMilitarySkill();
                if(context.target.hasDash('military')) {
                    newMil = '-';
                }
                let newPol = context.target.getPoliticalSkill();
                if(context.target.hasDash('political')) {
                    newPol = '-';
                }
                this.game.addMessage('{0} changes his base {1} skill to {2} and base {3} skill to {4}', context.source, 'military', newMil, 'political', newPol);
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
