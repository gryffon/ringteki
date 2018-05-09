const StrongholdCard = require('../../strongholdcard.js');

class ShiroNishiyama extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give defending characters +1/+1',
            cost: ability.costs.bowSelf(),
            condition: context => context.player.anyCardsInPlay(card => card.isDefending()),
            effect: 'add +1{1}/+1{2} to all defenders they control',
            effectArgs: () => ['military', 'political'],
            handler: context => context.player.cardsInPlay.each(card => {
                if(card.isDefending()) {
                    this.untilEndOfConflict(ability => ({
                        match: card,
                        effect: [
                            ability.effects.modifyMilitarySkill(1),
                            ability.effects.modifyPoliticalSkill(1)
                        ]
                    }));
                }
            })
        });
    }
}

ShiroNishiyama.id = 'shiro-nishiyama';

module.exports = ShiroNishiyama;
