const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class SocialPuppeteer extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.mustBeChosen({ restriction: 'opponentEvents' })
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
