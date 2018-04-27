const DrawCard = require('../../drawcard.js');

class Deathseeker extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove fate/discard character',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && context.source.isAttacking()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller !== context.player && 
                                                  (card.fate > 0 ? card.allowGameAction('removeFate', context) : card.allowGameAction('discardFromPlay', context))
            },
            effect: '{1} {0}',
            effectItems: context => context.target.fate > 0 ? 'remove 1 fate from' : 'discard',
            handler: context => {
                if(context.target.fate === 0) {
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                } else {
                    this.game.applyGameAction(context, { removeFate: context.target });
                }
            }
        });
    }
}

Deathseeker.id = 'deathseeker';

module.exports = Deathseeker;
