const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, PlayTypes, Players, Durations } = require('../../Constants');

class EsteemedTeaHouse extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return attachment to owners hand',
            condition: context => this.game.isDuringConflict() &&
                    context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.returnToHand()
            },
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Opponent,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: PlayTypes.PlayFromHand,
                    restricts: 'copiesOfX',
                    params: context.target.name
                })
            }))
        });
    }
}


EsteemedTeaHouse.id = 'esteemed-tea-house';

module.exports = EsteemedTeaHouse;
