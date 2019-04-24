const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class KakitaRyoku extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character if you have the Imperial Favor',
            when: {
                onPhaseStarted: (event, context) => event.phase !== 'setup' && context.player.imperialFavor !== ''
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: ability.actions.honor()
            }
        });
    }
}

KakitaRyoku.id = 'kakita-ryoku';

module.exports = KakitaRyoku;
