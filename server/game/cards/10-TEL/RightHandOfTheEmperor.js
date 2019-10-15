import { Locations, Players, CardTypes, TargetModes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RightHandOfTheEmperor extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.honor > context.player.opponent.honor,
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this])
        });
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetModes.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 0,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi') && card.bowed,
                gameAction: AbilityDsl.actions.sequential([AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.source,
                        destination: Locations.ConflictDeck, bottom: true
                    }))
                ])
            }
        });
    }
}

RightHandOfTheEmperor.id = 'right-hand-of-the-emperor';

module.exports = RightHandOfTheEmperor;
