const DrawCard = require('../../drawcard.js');

class Misinformation extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give opponent\'s participating cards -1/-1',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid + 1 && 
                                  context.player.opponent.anyCardsInPlay(card => card.isParticipating()),
            effect: 'give all opposing characters -1{1}/-1{2}',
            effectArgs: () => ['military', 'political'],
            handler: context => context.player.opponent.cardsInPlay.each(card => {
                if(card.isParticipating()) {
                    context.source.untilEndOfConflict(ability => ({
                        match: card,
                        effect: [
                            ability.effects.modifyMilitarySkill(-1),
                            ability.effects.modifyPoliticalSkill(-1)
                        ]
                    }));
                }
            })
        });
    }
}

Misinformation.id = 'misinformation';

module.exports = Misinformation;
