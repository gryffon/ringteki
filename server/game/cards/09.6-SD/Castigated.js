const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class Castigated extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.delayedEffect({
                condition: context => !context.source.parent.hasDash('political') && context.source.parent.getPoliticalSkill() < 1,
                message: '{0} is discarded due to {1}\'s lasting effect',
                messageArgs: context => [context.target, context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }

    canPlayOn(card) {
        return card.isParticipating() && super.canPlayOn(card);
    }

    canPlay(context, playType) {
        if(!context.game.isDuringConflict('political') || !context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('imperial'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

Castigated.id = 'castigated';

module.exports = Castigated;
