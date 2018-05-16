const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WarDogMaster extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            // TODO: make discard a cost here
            when: {
                onConflictDeclared: (event, context) => event.conflict.attackers.includes(context.source) && context.player.dynastyDeck.size() > 0
            },
            effect: 'give {0} a bonus to their military skill',
            handler: context => {
                let card = context.player.dynastyDeck.first();
                let bonus = card.getCost();
                bonus = _.isNumber(bonus) ? bonus : 0;
                this.game.addMessage('{0} discards {2} and {1} gets a bonus of +{3}{4}/+0{5}', context.player, context.source, card, bonus, 'military', 'political');
                context.player.moveCard(card, 'dynasty discard pile');
                context.source.untilEndOfConflict(ability => ({
                    match: context.source,
                    effect: ability.effects.modifyMilitarySkill(bonus)
                }));
            }
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
