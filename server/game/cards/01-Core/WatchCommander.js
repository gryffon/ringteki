const DrawCard = require('../../drawcard.js');

class WatchCommander extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.reaction({
            title: 'Force opponent to lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.loseHonor()
        });
    }
}

WatchCommander.id = 'watch-commander';

module.exports = WatchCommander;
