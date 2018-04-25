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
                    'Honor a character you control': context => context.player.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('honor', context) && card.allowGameAction('target', context);
                    }),
                    'Dishonor an opposing character': context => context.player.opponent && context.player.opponent.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('dishonor', context) && card.allowGameAction('target', context);
                    })
                }
            },
            effect: '{0}',
            effectItems: context => context.select === 'Honor a character you control', 'honor a friendly character', 'dishonor an opposing character',
            handler: context => {
                if(context.select === 'Honor a character you control') {
                    this.game.promptForSelect(context.player, {
                        cardType: 'character',
                        gameAction: ability.actions.honor(),
                        cardCondition: card => card.isParticipating() && card.controller === context.player && card.allowGameAction('target', context),
                        source: context.source,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} chooses to honor {1}', player, card);
                            this.game.openEventWindow(GameActions.eventTo.honor(card, context));
                            return true;
                        }
                    });
                } else {
                    let otherPlayer = context.player.opponent;
                    this.game.promptForSelect(otherPlayer, {
                        cardType: 'character',
                        gameAction: 'dishonor',
                        cardCondition: card => card.isParticipating() && card.controller === otherPlayer && card.allowGameAction('target', context),
                        source: context.source,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} chooses to dishonor {1}', player, card);
                            this.game.openEventWindow(GameActions.eventTo.dishonor(card, context));
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

