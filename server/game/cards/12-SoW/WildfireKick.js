const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class WildfireKick extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give opponent\'s characters -2/-2',
            condition: context =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3,
            target: {
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getMilitarySkill() <= context.target.getMilitarySkill() && card !== context.source),
                effect: AbilityDsl.effects.modifyBothSkills(-2)
            })),
            effect: 'give {1}\'s participating characters -2{2}/-2{3} if their military skill is equal to or lower than {4}. This affects: {5}',
            effectArgs: context => [context.player.opponent, 'military', 'political', context.target.getMilitarySkill(), context.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getMilitarySkill() <= context.target.getMilitarySkill() && card !== context.source)]
        });
    }
}

WildfireKick.id = 'wildfire-kick';

module.exports = WildfireKick;
