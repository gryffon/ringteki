const DrawCard = require('../../drawcard.js');

class KitsukiYaruma extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(context => context.source.hasTrait('poison'))
        });
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'province',
                cardCondition: card => !card.isBroken && !card.facedown
            },
            effect: 'turn {0} facedown',
            handler: context => {
                context.target.leavesPlay();
                if(context.target.isConflictProvince()) {
                    this.game.addMessage('{0} is immediately revealed again!', context.target);
                    context.target.inConflict = true;
                    this.game.raiseEvent('onProvinceRevealed', { conflict: this.game.currentConflict, province: context.target });
                } else {
                    context.target.facedown = true;
                }
            }
        });
    }
}

KitsukiYaruma.id = 'kitsuki-yaruma';

module.exports = KitsukiYaruma;
