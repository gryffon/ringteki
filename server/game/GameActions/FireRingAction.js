const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes, EventNames } = require('../Constants');

class FireRingAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.map = new Map();
    }

    setup() {
        this.name = 'fireRingEffect';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'change {0}\'s personal honor';
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        for(const target of this.target) {
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
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character) {
            return false;
        } else if(this.name !== '') {
            return super.canAffect(card, context);
        }
        return card.allowGameAction('honor', context) || card.allowGameAction('dishonor', context);
    }

    getEventArray(context) {
        return this.target.filter(target => this.map.get(target) && this.canAffect(target, context)).map(target => this.getEvent(target, context));
    }

    getEvent(card, context) {
        let action = this.map.get(card);
        if(action === 'honor') {
            return super.createEvent(EventNames.OnCardHonored, { card: card, context: context }, () => card.honor());
        } else if(action === 'dishonor') {
            return super.createEvent(EventNames.OnCardDishonored, { card: card, context: context }, () => card.dishonor());
        }
    }
}

module.exports = FireRingAction;
