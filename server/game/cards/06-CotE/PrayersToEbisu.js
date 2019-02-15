const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PrayersToEbisu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Re-balance honor and draw a card',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor(context => ({
                    target: context.game.getPlayers().filter(player => player.honor >= 19),
                    amount: 4
                })),
                AbilityDsl.actions.gainHonor(context => ({
                    target: context.game.getPlayers().filter(player => player.honor <= 6),
                    amount: 4
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player
                }))
            ]),
            effect: 'draw a card, make each player with 19 or more honor lose 4 honor, and make each player with 6 or fewer honor gain 4 honor'
        });
    }
}

PrayersToEbisu.id = 'prayers-to-ebisu';

module.exports = PrayersToEbisu;
