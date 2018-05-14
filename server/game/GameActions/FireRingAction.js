const CardGameAction = require('./CardGameAction');

class FireRingAction extends CardGameAction {
    constructor() {
        super('fireRingEffect');
        this.targetType = ['character'];
        this.effect = 'change {0}\'s personal honor';
        this.map = new Map();
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        for(const target of this.targets) {
            if(!target.allowGameAction('honor', context)) {
                this.map.set(target, 'dishonor');
            } else if(!target.allowGameAction('dishonor', context)) {
                this.map.set(target, 'honor');
            } else {
                let createHandler = action => () => {
                    this.map.set(target, action);
                    context.game.addMessage('{0} chooses to {1} {2}', context.player, action, target);
                };
                context.game.promptWithHandlerMenu(context.player, {
                    source: context.source,
                    choices: ['Honor ' + target.name, 'Dishonor ' + target.name],
                    handlers: [
                        createHandler('honor'),
                        createHandler('dishonor')
                    ]
                });
            }
        }
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.type !== 'character') {
            return false;
        } else if(this.name !== '') {
            return super.canAffect(card, context);
        }
        return card.allowGameAction('honor', context) || card.allowGameAction('dishonor', context);
    }

    getEventArray(context) {
        return this.targets.filter(target => this.map.get(target) && this.canAffect(target, context)).map(target => this.getEvent(target, context));
    }

    getEvent(card, context) {
        let action = this.map.get(card);
        if(action === 'honor') {
            return super.createEvent('onCardHonored', { card: card, context: context }, () => card.honor());
        } else if(action === 'dishonor') {
            return super.createEvent('onCardDishonored', { card: card, context: context }, () => card.dishonor());
        }
    }
}

module.exports = FireRingAction;
