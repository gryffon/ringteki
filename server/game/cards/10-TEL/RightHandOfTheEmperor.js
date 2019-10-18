import { Locations, Players, CardTypes, TargetModes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RightHandOfTheEmperor extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.honor > context.player.opponent.honor,
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
                numCards: 99, //numCards: 0 doesn't seem to work with optional cost and TargetModes.MaxStat
                optional: true,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi') && card.bowed,
                gameAction: AbilityDsl.actions.ready()
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                target: context.source,
                destination: Locations.ConflictDeck, bottom: true
            })),
            effect: 'ready {0}{1}.  {2} is placed on the bottom of {3}\'s conflict deck',
            effectArgs: context => [
                context.target.length > 0 ? '' : 'no one',
                context.source,
                context.source.owner]
        });
    }
}

RightHandOfTheEmperor.id = 'right-hand-of-the-emperor';

module.exports = RightHandOfTheEmperor;
