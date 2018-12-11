const DrawCard = require('../../drawcard.js');

class HidaYakamo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            effect: ability.effects.cardCannot('loseDuels')
        });

        this.persistentEffect({
            condition: context =>
                context.player.opponent && context.player.honor < context.player.opponent.honor &&
                this.game.isDuringConflict('military'),
            effect: ability.effects.doesNotBow()
        });
    }
}

HidaYakamo.id = 'hida-yakamo';

module.exports = HidaYakamo;
