const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { CardTypes, Players } = require('../../Constants');

class MagnificentTriumph extends DrawCard {
    setupCardAbilities(ability) {
        this.duelWinnersThisConflict = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);
        this.action({
            title: 'Give a character +2/+2',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => this.duelWinnersThisConflict.includes(card),
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.modifyBothSkills(2),
                        ability.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsEvents'
                        })
                    ]
                })
            },
            effect: 'give {0} +2{1}, +2{2}, and prevent them from being targeted by opponent\'s events',
            effectArgs: () => ['military', 'political']
        });
    }

    onConflictFinished() {
        this.duelWinnersThisConflict = [];
    }

    afterDuel(event) {
        if(event.duel.winner) {
            this.duelWinnersThisConflict.push(event.duel.winner);
        }
    }
}

MagnificentTriumph.id = 'magnificent-triumph';

module.exports = MagnificentTriumph;
