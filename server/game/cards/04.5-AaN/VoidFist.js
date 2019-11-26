const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class VoidFist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and send a character home',
            condition: context =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 2,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && this.game.currentConflict.getCharacters(context.player).some(myCard =>
                        myCard.hasTrait('monk') && myCard.militarySkill >= card.militarySkill
                    ),
                gameAction: [ability.actions.bow(), ability.actions.sendHome()]
            },
            effect: 'bow {0} and send them home'
        });
    }
}

VoidFist.id = 'void-fist';

module.exports = VoidFist;
