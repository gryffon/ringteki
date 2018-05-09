const DrawCard = require('../../drawcard.js');

class IsawaAtsuko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Wield the power of the void',
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('void'),
            effect: 'give friendly characters +1/+1 and opposing characters -1/-1',
            handler: context => {
                context.player.cardsInPlay.each(card => {
                    if(card.isParticipating()) {
                        context.source.untilEndOfConflict(ability => ({
                            match: card,
                            effect: [
                                ability.effects.modifyMilitarySkill(1),
                                ability.effects.modifyPoliticalSkill(1)
                            ]
                        }));
                    }
                });
                if(context.player.opponent) {
                    context.player.opponent.cardsInPlay.each(card => {
                        if(card.isParticipating()) {
                            context.source.untilEndOfConflict(ability => ({
                                match: card,
                                effect: [
                                    ability.effects.modifyMilitarySkill(-1),
                                    ability.effects.modifyPoliticalSkill(-1)
                                ]
                            }));
                        }
                    });
                }
            }
        });
    }
}

IsawaAtsuko.id = 'isawa-atsuko';

module.exports = IsawaAtsuko;
