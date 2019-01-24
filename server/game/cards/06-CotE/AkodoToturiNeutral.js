const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class AkodoToturiNeutral extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent each player playing cards from hand',
            condition: context => context.source.isParticipating() && context.player.imperialFavor !== '',
            effect: 'prevent each player playing cards from hand',
            gameAction: [
                ability.actions.playerLastingEffect({
                    targetController: Players.Any,
                    effect: ability.effects.playerCannot({
                        cannot: PlayTypes.PlayFromHand
                    })
                })
            ]
        });
    }
}

AkodoToturiNeutral.id = 'akodo-toturi-neutral';

module.exports = AkodoToturiNeutral;
