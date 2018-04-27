const DrawCard = require('../../drawcard.js');

class Levy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take an honor or a fate from your opponent',
            condition: context => context.player.opponent,
            target: {
                player: 'opponent',
                mode: 'select',
                choices: {
                    'Give your opponent 1 fate': context => context.player.opponent.fate > 0,
                    'Give your opponent 1 honor': context => context.player.opponent.honor > 0
                }
            },
            effect: 'force their opponent to give them 1 {1}',
            effectItems: context => context.select === 'Give your opponent 1 fate' ? 'fate' : 'honor',
            handler: context => {
                if(context.select === 'Give your opponent 1 fate') {
                    this.game.transferFate(context.player, context.player.opponent, 1);
                } else {
                    this.game.transferHonor(context.player.opponent, context.player, 1);
                }
            }
        });
    }
}

Levy.id = 'levy';

module.exports = Levy;
