const DrawCard = require('../../drawcard.js');

class SocialPuppeteer extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.mustBeChosen({ restricts: 'opponentsEvents' })
        });

        this.action({
            title: 'Switch honor dials with opponent',
            condition: context =>
                context.source.isParticipating() && context.player.opponent &&
                context.player.showBid !== context.player.opponent.showBid,
            effect: 'switch honor dials with {1}',
            effectArgs: context => context.player.opponent,
            gameAction: [
                ability.actions.setHonorDial(context => ({ value: context.player.showBid })),
                ability.actions.setHonorDial(context => ({
                    target: context.player,
                    value: context.player.opponent.showBid
                }))
            ]
        });
    }
}

SocialPuppeteer.id = 'social-puppeteer';

module.exports = SocialPuppeteer;
