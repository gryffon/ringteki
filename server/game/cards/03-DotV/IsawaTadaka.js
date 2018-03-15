const DrawCard = require('../../drawcard.js');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            match: player => !this.game.rings.earth.isConsideredClaimed(player),
            effect: ability.effects.cannotPlay(context => context && context.source.type === 'event' && context.player.conflictDiscardPile.any(card => card.name === context.source.name))
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka'; // This is a guess at what the id might be - please check it!!!

module.exports = IsawaTadaka;
