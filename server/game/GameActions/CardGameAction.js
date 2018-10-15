const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector');

class CardGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
        this.promptWithHandlerMenu = null;
    }

    setup() {
        this.targetType = ['character', 'attachment', 'holding', 'event', 'stronghold', 'province', 'role'];
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        if(this.promptForSelect) {
            let contextCopy = context.copy();
            contextCopy.stage = 'effect';
            return this.getSelector().hasEnoughTargets(contextCopy);
        } else if(this.promptWithHandlerMenu && !this.promptWithHandlerMenu.customHandler) {
            let contextCopy = context.copy();
            contextCopy.stage = 'effect';
            return this.promptWithHandlerMenu.cards.some(card => this.canAffect(card, contextCopy));
        }
        return result;
    }

    getSelector() {
        let condition = this.promptForSelect.cardCondition || (() => true);
        let cardCondition = (card, context) => (this.promptForSelect.customHandler || this.canAffect(card, context)) && condition(card, context);
        return CardSelector.for(Object.assign({}, this.promptForSelect, { cardCondition: cardCondition }));
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if(this.promptForSelect) {
            let selector = this.getSelector();
            if(!selector.hasEnoughTargets(context)) {
                this.target = [];
                return;
            }
            let properties = this.promptForSelect;
            if(properties.customHandler) {
                properties.onSelect = (player, cards) => properties.customHandler(cards, this);
            }
            if(!properties.player) {
                properties.player = context.player;
            }
            let defaultProperties = {
                context: context,
                selector: selector,
                onSelect: (player, cards) => {
                    this.setTarget(cards);
                    if(this.promptForSelect.message) {
                        let messageArgs = this.promptForSelect.messageArgs || [];
                        if(typeof messageArgs === 'function') {
                            messageArgs = messageArgs(cards);
                        }
                        if(!Array.isArray(messageArgs)) {
                            messageArgs = [messageArgs];
                        }
                        context.game.addMessage(this.promptForSelect.message, ...messageArgs);
                    }
                    return true;
                }
            };
            context.game.promptForSelect(properties.player, Object.assign(defaultProperties, properties));
        } else if(this.promptWithHandlerMenu) {
            let properties = this.promptWithHandlerMenu;
            if(!properties.customHandler) {
                properties.cards = properties.cards.filter(card => this.canAffect(card, context));
            }
            if(properties.cards.length === 0) {
                return;
            }
            if(!properties.player) {
                properties.player = context.player;
            }
            if(properties.customHandler) {
                properties.cardHandler = card => properties.customHandler(card, this);
            }
            let defaultProperties = {
                context: context,
                cardHandler: card => {
                    this.setTarget(card);
                    if(properties.message) {
                        context.game.addMessage(properties.message, properties.player, context.source, card);
                    }
                }
            };
            context.game.promptWithHandlerMenu(properties.player, Object.assign(defaultProperties, properties));
        }
    }

    defaultTargets(context) {
        return context.source;
    }

    checkEventCondition(event) {
        return this.canAffect(event.card, event.context);
    }

    fullyResolved(event) {
        return this.target.length === 0 || this.target.includes(event.card);
    }
}

module.exports = CardGameAction;
