const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AsahinaMaeko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase cost to play cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'increase the cost of cards this conflict for both players',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                effect: AbilityDsl.effects.increaseCost({
                    amount: 1
                }),
                targetController: Players.Any
            })
        });
    }
}

AsahinaMaeko.id = 'asahina-maeko';

module.exports = AsahinaMaeko;
