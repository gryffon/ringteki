const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players, TargetModes } = require('../../Constants');

class WarriorsOfTheWind extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Re-arrange participating cavalry characters',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.sendHome(context => ({
                target: context.player.filterCardsInPlay(card => card.hasTrait('cavalry') && card.isParticipating())
            })),
            then: {
                target: {
                    activePromptTitle: 'Choose characters',
                    mode: TargetModes.Unlimited,
                    optional: true,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('cavalry'),
                    gameAction: AbilityDsl.actions.moveToConflict()
                },
                message: '{0} chooses to move {2} to the conflict'
            }
        });
    }
}

WarriorsOfTheWind.id = 'warriors-of-the-wind';

module.exports = WarriorsOfTheWind;
