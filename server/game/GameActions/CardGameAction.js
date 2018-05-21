const CardSelector = require('../CardSelector');
const GameAction = require('./GameAction');

class CardGameAction extends GameAction {
    constructor(name) {
        super(name);
        this.targetType = ['character', 'attachment', 'holding', 'event', 'stronghold', 'province', 'role'];
    }

    promptForSelect(propsFunc) {
        this.selectProps = propsFunc;
        return this;
    }

    getSelector(context) {
        if(!this.selectProps) {
            throw new Error('Selector requested with no prop function');
        }
        return CardSelector.for(Object.assign({ gameAction: this }, this.selectProps(context)));
    }

    promptWithHandlerMenu(propsFunc) {
        this.handlerProps = propsFunc;
        return this;
    }

    hasLegalTarget(context) {
        if(this.handlerProps || this.selectProps) {
            return true;
        }
        return super.hasLegalTarget(context);
    }

    preEventHandler(context) {
        if(this.selectProps) {
            let properties = this.selectProps(context);
            if(!properties.player) {
                properties.player = context.player;
            }
            let defaultProperties = {
                context: context,
                gameAction: this,
                onSelect: (player, cards) => {
                    this.setTarget(cards, context);
                    context.game.addMessage(properties.message, player, context.source, cards);
                    return true;
                }
            };
            // TODO: What if there are no legal targets?
            context.game.promptForSelect(properties.player, Object.assign(defaultProperties, properties));
        }
        if(this.handlerProps) {
            let properties = this.handlerProps(context);
            if(!properties.player) {
                properties.player = context.player;
            }
            let defaultProperties = {
                source: context.source,
                cardHandler: card => {
                    this.setTarget(card, context);
                    context.game.addMessage(properties.message, properties.player, context.source, card);
                }
            };
            context.game.promptWithHandlerMenu(properties.player, Object.assign(defaultProperties, properties));
        }
    }

    getDefaultTargets(context) {
        return context.source;
    }

    checkEventCondition(event) {
        return this.canAffect(event.card, event.context);
    }
}

module.exports = CardGameAction;
