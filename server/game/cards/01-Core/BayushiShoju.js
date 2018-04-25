const DrawCard = require('../../drawcard.js');

class BayushiShoju extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -0/-1',
            limit: ability.limit.perRound(2),
            condition: context => context.source.isParticipating() && this.game.currentConflict.conflictType === 'political',
            target: {
                source: this,
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.controller !== this.controller
            },
            effect: 'reduce {0}\'s political skill by 1.  They will die if they reach 0',
            handler: context => context.source.untilEndOfConflict(ability => ({
                match: context.target,
                effect: [
                    ability.effects.modifyPoliticalSkill(-1),
                    ability.effects.terminalCondition({
                        context: context,
                        condition: () => context.target.getPoliticalSkill() < 1,
                        message: '{1} is discarded due to {0}\'s lasting effect',
                        gameAction: ability.actions.discardFromPlay()
                    })
                ]
            }))            
        });
    }
}

BayushiShoju.id = 'bayushi-shoju';

module.exports = BayushiShoju;
