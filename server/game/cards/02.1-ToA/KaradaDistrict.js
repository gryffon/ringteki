const DrawCard = require('../../drawcard.js');

class KaradaDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of an attachment',
            cost: ability.costs.giveFateToOpponent(1),
            target: {
                cardType: 'attachment',
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player.opponent
            },
            effect: 'take control of {0}',
            handler: context => {
                if(context.player.cardsInPlay.any(card => card.type === 'character' && ability.action.attach(context.target).canAffect(card, context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to attach ' + context.target.name + ' to',
                        source: context.source,
                        cardType: 'character',
                        gameAction: ability.action.attach(context.target),
                        cardCondition: (card, context) => card.controller === context.player,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} attaches {1} to {2}', player, context.target, card);
                            this.game.openEventWindow(ability.actions.attach(context.target).getEvent(card, context));
                            return true;
                        }
                    });
                } else {
                    this.game.addMessage('{0} cannot attach {1} to anyone so it is discarded', context.player, context.target);
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                }
            }
        });
    }
}

KaradaDistrict.id = 'karada-district';

module.exports = KaradaDistrict;
