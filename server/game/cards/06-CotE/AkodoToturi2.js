const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class AkodoToturi2 extends DrawCard {
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

AkodoToturi2.id = 'akodo-toturi-2';

module.exports = AkodoToturi2;
