const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { ConflictTypes, Locations } = require('../../Constants');

class CallousAshigaru extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard cards from provinces',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictType === ConflictTypes.Military &&
                    context.source.parent.isAttacking()
            },
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent ?
                    context.player.opponent.getDynastyCardsInProvince(Locations.Provinces) :
                    []
            }))
        });
    }

    canAttach(card, context) {
        if(!card.isUnique()) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

CallousAshigaru.id = 'callous-ashigaru';

module.exports = CallousAshigaru;

