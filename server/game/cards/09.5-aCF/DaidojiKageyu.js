const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class DaidojiKageyu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            condition: context => this.game.isDuringConflict('political') &&
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) > 0,
            gameAction: AbilityDsl.actions.draw(context => ({ amount: this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) })),
            effect: 'draw {1} card{2}',
            effectArgs: context => [
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent),
                this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent) > 1 ? 's' : ''
            ]
        });
    }
}

DaidojiKageyu.id = 'daidoji-kageyu';

module.exports = DaidojiKageyu;
