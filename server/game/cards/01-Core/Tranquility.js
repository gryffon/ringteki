const DrawCard = require('../../drawcard.js');

class Tranquility extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Opponent\'s characters at home can\'t use abilities',
            condition: context => this.game.isDuringConflict() && 
                                  this.game.findAnyCardsInPlay(card => !card.inConflict && card.controller !== context.player).length > 0,
            effect: 'stop characters at {1}\'s home from triggering abilities until the end of the conflict',
            effectArgs: context => context.player.opponent,
            handler: context => context.player.opponent.cardsInPlay.each(card => {
                if(card.type === 'character' && !card.isParticipating()) {
                    card.untilEndOfConflict(ability => ({
                        match: card,
                        effect: ability.effects.cardCannot('triggerAbilities')
                    }));
                }
            })
        });
    }
}

Tranquility.id = 'tranquility';

module.exports = Tranquility;
