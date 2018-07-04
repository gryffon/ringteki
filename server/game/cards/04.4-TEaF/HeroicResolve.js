const DrawCard = require('../../drawcard.js');

class HeroicResolve extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Ready attached character',
            condition: context => context.player.getClaimedRings().length >= 2,
            gameAction: ability.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}

HeroicResolve.id = 'heroic-resolve'; // This is a guess at what the id might be - please check it!!!

module.exports = HeroicResolve;
