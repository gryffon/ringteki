const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CloakOfNight extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a participating character +3 glory',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: AbilityDsl.effects.modifyGlory(3)
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardAbilities'
                        })
                    })
                ])
            },
            effect: 'give {0} +3 glory and prevent them from being chosen as the target of {1}\'s triggered abilities until the end of the conflict',
            effectArgs: context => [context.player.opponent]
        });
    }
}

CloakOfNight.id = 'cloak-of-night';
module.exports = CloakOfNight;
