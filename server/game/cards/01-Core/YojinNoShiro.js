const StrongholdCard = require('../../strongholdcard.js');

class YojinNoShiro extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking characters +1/+0',
            cost: ability.costs.bowSelf(),
            condition: context => context.player.anyCardsInPlay(card => card.isAttacking()),
            effect: 'give attacking characters +1{1}/+0{2}',
            effectArgs: () => ['military', 'political'],
            handler: context => context.player.cardsInPlay.each(card => {
                if(card.isAttacking()) {
                    context.source.untilEndOfConflict(ability => ({
                        match: card,
                        effect: ability.effects.modifyMilitarySkill(1)
                    }));
                }
            })
        });
    }
}

YojinNoShiro.id = 'yojin-no-shiro';

module.exports = YojinNoShiro;
