const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class OracleOfStone extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw 2 cards, then discard 2 cards',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw({
                    target: this.game.getPlayers(),
                    amount: 2
                }),
                AbilityDsl.actions.chosenDiscard({
                    target: this.game.getPlayers(),
                    amount: 2
                })
            ]),
            effect: 'make both players draw 2 cards, then discard 2 cards'
        });
    }
}

OracleOfStone.id = 'oracle-of-stone';

module.exports = OracleOfStone;
