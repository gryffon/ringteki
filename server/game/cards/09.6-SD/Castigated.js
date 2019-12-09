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

    canPlay(context, playType) {
        return (context.game.isDuringConflict('political') && this.hasImperialCharacter(context.source));
    }

    canPlayOn(card) {
        return card.isParticipating() && super.canPlayOn(card);
    }

    hasImperialCharacter(source) {
        return this.game.allCards.any(card => {
            (card.controller === source.controller && 
            card.hasTrait('imperial') && 
            !card.facedown && card.location === Locations.PlayArea && 
            card.type === CardTypes.Character)
        });
    }
}

Castigated.id = 'castigated';

module.exports = Castigated;
