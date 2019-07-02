const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Blackmail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }

    canPlay(context, playType) {
        if(context.player.opponent && context.player.honor < context.player.opponent.honor) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}

Blackmail.id = 'blackmail';

module.exports = Blackmail;
