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
            message: 'remove 1 fate from all opposing characters with lower glory than her',
            handler: context => {
                let cards = this.game.currentConflict.getOpponentCards(context.player);
                cards = cards.filter(card => card.getGlory() < context.source.getGlory());
                this.game.applyGameAction(context, { removeFate: cards });
            }
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
