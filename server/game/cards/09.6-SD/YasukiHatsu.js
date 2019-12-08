const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class YasukiHatsu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for attachment',
            effect: 'look at the top five cards of their deck',
            condition: context => context.source.isParticipating() && context.player.opponent && context.player.honor < context.player.opponent.honor,
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.type === CardTypes.Attachment
            })
        });
    }
}

YasukiHatsu.id = 'yasuki-hatsu';

module.exports = YasukiHatsu;

