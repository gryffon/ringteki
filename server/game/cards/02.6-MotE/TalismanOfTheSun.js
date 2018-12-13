const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes, EventNames } = require('../../Constants');

class TalismanOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move conflict to a different province',
            condition: context => context.player.isDefendingPlayer(),
            cost: ability.costs.bowSelf(),
            effect: 'move the conflict to another province',
            handler: context => this.game.promptForSelect(context.player, {
                context: context,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card !== this.game.currentConflict.conflictProvince && !card.isBroken && (card.location !== Locations.StrongholdProvince ||
                                        _.size(this.game.provinceCards.filter(card => card.isBroken && card.controller === context.player)) > 2),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {1}', context.player, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        this.game.raiseEvent(EventNames.OnCardRevealed, { context: context, card: card }, () => card.facedown = false);
                    }
                    return true;
                }
            })
        });
    }
}

TalismanOfTheSun.id = 'talisman-of-the-sun';

module.exports = TalismanOfTheSun;
