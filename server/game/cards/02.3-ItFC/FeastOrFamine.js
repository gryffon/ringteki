const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class FeastOrFamine extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Move fate from an opposing character',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    message: '{0} moves {1} fate from {2} to {3}',
                    messageArgs: card => [context.player, context.target.fate, context.target, card],
                    gameAction: AbilityDsl.actions.placeFate({
                        origin: context.target,
                        amount: 1
                    })
                }))
            },
            effect: 'move all fate from {0} to a character they control'
        });
    }
}

FeastOrFamine.id = 'feast-or-famine';

module.exports = FeastOrFamine;
