const DrawCard = require('../../drawcard.js');

class WarriorPoet extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: context => context.source.isParticipating() && this.game.currentConfict.getOpponentCards(context.player).length > 0,
            effect: 'reduce the skill of all opposing characters', 
            handler: context => context.player.opponent.cardsInPlay.each(card => {
                if(card.isParticipating()) {
                    context.source.untilEndOfConflict(ability => ({
                        match: card,
                        effect: [
                            ability.effects.modifyPoliticalSkill(-1),
                            ability.effects.modifyMilitarySkill(-1)
                        ]
                    }));
                }
            })
        });
    }
}

WarriorPoet.id = 'warrior-poet';

module.exports = WarriorPoet;
