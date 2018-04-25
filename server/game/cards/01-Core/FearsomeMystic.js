const DrawCard = require('../../drawcard.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('air'),
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: context => context.source.isParticipating() && context.player.opponent && 
                                  context.player.opponent.cardsInPlay.any(card => (
                                      card.isParticipating() && card.fate > 0 && 
                                      card.getGlory() < context.source.getGlory() && card.allowGameAction('removeFate', context)
                                  )),
            message: '{0} uses {1} to remove 1 fate from all opposing characters with lower glory than her',
            handler: context => this.game.applyGameAction(context, { removeFate: this.game.findAnyCardsInPlay(card => (
                card.isParticipating() && card.controller !== context.player && 
                card.getGlory() < context.source.getGlory() && 
                card.allowGameAction('removeFate', context)
            ))})
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
