const _ = require('underscore');

import { CardTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class DojiKuwanan extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => context.player && context.player.cardsInPlay.toArray().find(card => card.printedName === 'Doji Hotaru'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: context => [context.source, context.player.cardsInPlay.find(card => card.printedName === 'Doji Hotaru')],
                gameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.player.cardsInPlay.find(card => card.printedName === 'Doji Hotaru')
                }))
            })
        });
        this.action({
            title: 'Bow a participating character with lower military skill',
            condition: context => context.source.game.isDuringConflict('military') &&
                context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

DojiKuwanan.id = 'doji-kuwanan';

module.exports = DojiKuwanan;
