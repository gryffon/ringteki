const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TrustedAdvisor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onMoveFate: (event, context) => context.source.isParticipating() &&
                    event.origin && event.origin.type === 'ring' &&
                    event.recipient && event.recipient === context.player
            },
            gameAction: AbilityDsl.actions.draw(),
            effect: 'draw a card'
        });
    }
}

TrustedAdvisor.id = 'trusted-advisor';

module.exports = TrustedAdvisor;
