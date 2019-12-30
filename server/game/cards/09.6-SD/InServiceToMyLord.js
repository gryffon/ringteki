import { Locations, CardTypes, PlayTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class InServiceToMyLord extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this], PlayTypes.Other)
        });
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique()
            }),
            target: {
                activePromptTitle: 'Choose a unique character',
                cardType: CardTypes.Character,
                cardCondition: card => card.isUnique(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.source,
                        destination: Locations.ConflictDeck, bottom: true
                    }))
                ])
            },
            effect: 'ready {0}.  {1} is placed on the bottom of {2}\'s conflict deck',
            effectArgs: context => [
                context.source,
                context.source.owner]
        });
    }
}

InServiceToMyLord.id = 'in-service-to-my-lord';

module.exports = InServiceToMyLord;
