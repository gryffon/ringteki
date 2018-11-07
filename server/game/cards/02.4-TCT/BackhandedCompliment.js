const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');

class BackhandedCompliment extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Select a player to lose an honor and draw a card',
            target: {
                mode: TargetModes.Select,
                choices:  {
                    'Me': [ability.actions.loseHonor(context => ({ target: context.player })), ability.actions.draw()],
                    'My Opponent': [ability.actions.loseHonor(), ability.actions.draw(context => ({ target: context.player.opponent }))]
                }
            },
            effect: 'to make {1} lose an honor and draw a card',
            effectArgs: context => context.select === 'Me' ? context.player : context.player.opponent
        });
    }
}

BackhandedCompliment.id = 'backhanded-compliment';

module.exports = BackhandedCompliment;
