const DrawCard = require('../../drawcard.js');

class GraspOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent\'s cards cannot join this conflict',
            condition: context => this.game.currentConflict && context.player.opponent,
            cost: ability.costs.bowSelf(),
            message: '{0} bows {1} to prevent the opponent from bringing characters to the conflict',
            handler: context => {
                //Cannot move characters into the conflict
                context.player.opponent.cardsInPlay.each(card => {
                    context.source.untilEndOfConflict(ability => ({
                        match: card,
                        effect: ability.effects.cardCannot('moveToConflict')
                    }));
                });

                //Cannot play characters
                context.source.untilEndOfConflict(ability => ({
                    targetController: 'opponent',
                    effect: ability.effects.playerCannot('play', context => context.source.type === 'character' && context.source.location === 'hand')                    
                }));
            }
        });      
    }

    canAttach(card) {
        if(card.hasTrait('shugenja') === false || card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card);
    }
}

GraspOfEarth.id = 'grasp-of-earth';

module.exports = GraspOfEarth;
