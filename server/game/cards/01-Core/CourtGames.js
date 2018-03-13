const DrawCard = require('../../drawcard.js');

class CourtGames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            max: ability.limit.perConflict(1),
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Honor a character you control': context => this.controller.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('honor', context) && card.allowGameAction('target', context);
                    }),
                    'Dishonor an opposing character': context => this.controller.opponent && this.controller.opponent.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('dishonor', context) && card.allowGameAction('target', context);
                    })
                }
            },
            handler: context => {
                if(context.select === 'Honor a character you control') {
                    this.game.promptForSelect(this.controller, {
                        cardType: 'character',
                        gameAction: 'honor',
                        cardCondition: card => card.isParticipating() && card.controller === this.controller && card.allowGameAction('target', context),
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, card);
                            this.game.applyGameAction(context, { honor: card });
                            return true;
                        }
                    });
                } else {
                    let otherPlayer = this.controller.opponent;
                    this.game.promptForSelect(otherPlayer, {
                        cardType: 'character',
                        gameAction: 'dishonor',
                        cardCondition: card => card.isParticipating() && card.controller === otherPlayer && card.allowGameAction('target', context),
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, card);
                            this.game.applyGameAction(context, { dishonor: card });
                            return true;
                        }
                    });
                }
            }
        });
    }
}

CourtGames.id = 'court-games';

module.exports = CourtGames;

