const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players, TargetModes } = require('../../Constants');

class WarriorsOfTheWind extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Re-arrange participating cavalry characters',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome(context => ({
                    target: context.player.filterCardsInPlay(card => card.hasTrait('cavalry') && card.isParticipating())
                })),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose characters',
                    mode: TargetModes.Unlimited,
                    optional: true,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: card => card.hasTrait('cavalry'),
                    gameAction: AbilityDsl.actions.moveToConflict(),
                    message: '{0} chooses to move {1} to the conflict',
                    messageArgs: (cards, player) => [player, cards]
                })
            ])
        });
    }
}

WarriorsOfTheWind.id = 'warriors-of-the-wind';

module.exports = WarriorsOfTheWind;
