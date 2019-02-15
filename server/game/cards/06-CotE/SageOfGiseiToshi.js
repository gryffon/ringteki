const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class SageOfGiseiToshi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move home, then move character home',
            condition: context => this.game.isDuringConflict() && context.player.opponent && context.player.opponent.honor < context.player.honor,
            gameAction: ability.actions.sendHome(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('sendHome', context)
            },
            then: context => ({
                gameAction: ability.actions.sendHome({ target: context.target })
            })
        });
    }
}

SageOfGiseiToshi.id = 'sage-of-gisei-toshi';

module.exports = SageOfGiseiToshi;
