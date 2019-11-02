import { EventNames } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class IsawaTsuke extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Fire ring same cost characters',
            when: {
                onCardDishonored: (event, context) => {
                    const dishonoredByYourEffect = (context.player === event.context.player);
                    const dishonoredByRingEffect = (event.context.source.type === 'ring');
                    return dishonoredByYourEffect && dishonoredByRingEffect;
                },
                onCardHonored: (event, context) => {
                    const honoredByYourEffect = (context.player === event.context.player);
                    const honoredByRingEffect = (event.context.source.type === 'ring');
                    return honoredByYourEffect && honoredByRingEffect;
                }
            },
            gameAction: AbilityDsl.actions.conditional(context => ({
                condition: context.event.name === EventNames.OnCardDishonored,
                trueGameAction: AbilityDsl.actions.dishonor({
                    target: this.getTsukeTargets(context)
                }),
                falseGameAction: AbilityDsl.actions.honor({
                    target: this.getTsukeTargets(context)
                })
            }))
        });
    }
    getTsukeTargets(context) {
        let targetedCharacter = context.event.card;
        let targetedCharacterController = context.event.card.controller;

        return targetedCharacterController
            .cardsInPlay
            .filter(card => card.printedCost === targetedCharacter.printedCost);
    }
}

IsawaTsuke.id = 'isawa-tsuke';

module.exports = IsawaTsuke;
