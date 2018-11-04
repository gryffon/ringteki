const CardGameAction = require('./CardGameAction');
const DiscardFromPlayAction = require('./DiscardFromPlayAction');
const { Locations } = require('../Constants');

class CreateTokenAction extends CardGameAction {
    setup() {
        this.name = 'createToken';
        this.targetType = ['character', 'holding'];
        this.effectMsg = 'create a token';
    }

    canAffect(card, context) {
        if(!card.facedown || ![Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location)) {
            return false;
        } else if(!context.game.isDuringConflict('military')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let token = context.game.createToken(card);
            card.owner.removeCardFromPile(card);
            context.refillProvince(card.owner, card.location);
            card.moveTo('spirit of the river');
            card.owner.moveCard(token, Locations.PlayArea);
            if(context.player.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(token);
            } else {
                context.game.currentConflict.addDefender(token);
            }
            context.source.delayedEffect(() => ({
                target: token,
                context: context,
                when: {
                    onConflictFinished: () => true
                },
                message: '{1} returns to the deep',
                gameAction: new DiscardFromPlayAction()
            }));
        });
    }
}

module.exports = CreateTokenAction;
