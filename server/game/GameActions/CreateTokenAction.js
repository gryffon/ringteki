const CardGameAction = require('./CardGameAction');
const DiscardFromPlayAction = require('./DiscardFromPlayAction');
const DrawCard = require('../drawcard.js');

class SpiritOfTheRiver extends DrawCard {
    constructor(facedownCard) {
        super(facedownCard.owner, {
            clan: 'neutral',
            cost: null,
            glory: 0,
            id: 'spirit-of-the-river',
            military: 1,
            name: 'Spirit of the River',
            political: null,
            side: 'dynasty',
            text: '',
            type: 'character',
            traits: ['spirit', 'cavalry'],
            unicity: false
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, 'dynasty discard pile');
        this.game.queueSimpleStep(() => this.owner.removeCardFromPile(this));
        super.leavesPlay();
    }

    getSummary() {
        let summary = super.getSummary();
        return Object.assign(summary, { isToken: true });
    }
}

class CreateTokenAction extends CardGameAction {
    setup() {
        this.name = 'createToken';
        this.targetType = ['character', 'holding'];
        this.effectMsg = 'create a token';
    }

    canAffect(card, context) {
        if(!card.facedown || !['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)) {
            return false;
        } else if(!context.game.isDuringConflict('military')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let token = new SpiritOfTheRiver(card);
            card.owner.removeCardFromPile(card);
            card.moveTo('spirit of the river');
            card.owner.moveCard(token, 'play area');
            if(context.player.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(token);
            } else {
                context.game.currentConflict.addDefender(token);
            }
            context.source.delayedEffect(() => ({
                target: token,
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
