const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AsahinaArtisan extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character +0/+3',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.source && card.isFaction('crane'),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(3)
                }))
            },
            effect: 'give {0} +3{1} skill',
            effectArgs: () => 'political'
        });
    }
}

AsahinaArtisan.id = 'asahina-artisan';

module.exports = AsahinaArtisan;
