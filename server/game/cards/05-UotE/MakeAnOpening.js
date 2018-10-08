const DrawCard = require('../../drawcard.js');

class MakeAnOpening extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Give -X/-X to opposing character, where X is the difference between current honor dial bid values',
            condition: context =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.player) >= 1 &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) >= 1 &&
                context.player.showBid &&
                context.player.opponent.showBid &&
                context.player.showBid !== context.player.opponent.showBid,
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card =>
                    card.isParticipating() &&
                    (card.militarySkill > 0 || card.politicalSkill > 0),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(() => -(this.getHonorDialDifference(context)))
                }))
            }
        });
    }

    getHonorDialDifference(context) {
        return Math.abs(context.player.showBid - context.player.opponent.showBid);
    }
}

MakeAnOpening.id = 'make-an-opening';

module.exports = MakeAnOpening;
