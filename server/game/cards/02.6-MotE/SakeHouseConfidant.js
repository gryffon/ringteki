const DrawCard = require('../../drawcard.js');

class SakeHouseConfidant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give Shinobi +2 political',
            condition: () => this.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            effect: 'give their Shinobi +0/+2',
            handler: context => context.player.cardsInPlay.each(card => {
                if(card.hasTrait('shinobi')) {
                    context.source.untilEndOfConflict(ability => ({
                        match: card,
                        effect: ability.effects.modifyPoliticalSkill(2)
                    }));
                }
            })
        });
    }
}

SakeHouseConfidant.id = 'sake-house-confidant';

module.exports = SakeHouseConfidant;
