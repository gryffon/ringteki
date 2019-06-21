const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BlackmailArtist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take 1 honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player &&
                                                   context.player.opponent && event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.takeHonor()
        });
    }
}

BlackmailArtist.id = 'blackmail-artist';

module.exports = BlackmailArtist;
