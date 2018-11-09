const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class OrigamiMaster extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move an honor token',
            condition: context => context.source.isHonored,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isDishonored || card.allowGameAction('becomeHonored', context)
            },
            effect: 'move an honor token to {0}',
            handler: context => {
                if(context.source.isHonored) {
                    context.source.isHonored = false;
                    if(context.target.isDishonored) {
                        context.target.isDishonored = false;
                    } else {
                        context.target.isHonored = true;
                    }
                }
            }
        });
    }
}

OrigamiMaster.id = 'origami-master';

module.exports = OrigamiMaster;
