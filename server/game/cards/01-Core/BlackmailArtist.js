const DrawCard = require('../../drawcard.js');

class BlackmailArtist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take 1 honor',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player && 
                                                   context.player.opponent && event.conflict.conflictType === 'political'
            },
            effect: 'take 1 honor from {0}',
            effectItems: context => context.player.opponent,
            handler: context => this.game.transferHonor(context.player.opponent, context.player, 1)
        });
    }
}

BlackmailArtist.id = 'blackmail-artist';

module.exports = BlackmailArtist;
