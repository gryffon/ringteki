const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players } = require('../../Constants');

class TheSpearRushesForth extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a participating character',
            condition: () => this.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.discardStatusToken({
                cardCondition: card => card.isHonored && card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

TheSpearRushesForth.id = 'the-spear-rushes-forth';

module.exports = TheSpearRushesForth;
