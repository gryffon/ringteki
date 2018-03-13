const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ConsumedByFiveFires extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove up to 5 fate from characters',
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('shugenja')) && this.controller.opponent &&
                             this.controller.opponent.cardsInPlay.any(card => card.fate > 0),
            methods: ['consumedByFiveFiresChooseCard'],
            handler: context => {
                this.game.addMessage('{0} plays {1}', this.controller, this);
                this.consumedByFiveFiresChooseCard(context, {}, []);
            }
        });
    }

    consumedByFiveFiresChooseCard(context, targets, messages) {
        let fateRemaining = 5 - _.reduce(targets, (totalFate, fateToRemove) => totalFate + fateToRemove, 0);
        if(fateRemaining === 0 || !this.controller.opponent.cardsInPlay.any(card => card.fate > 0 && !_.keys(targets).includes(card.uuid))) {
            this.game.addMessage('{0} chooses to: {1}', this.controller, messages);
            let keys = _.getKeys(targets);
            let events = this.game.applyGameAction(context, { removeFate: context.player.opponent.cardsInPlay.filter(card => keys.includes(card.uuid)) });
            _.each(events, event => event.fate = targets[event.card.uuid]);
            return;
        }
        this.game.promptForSelect(this.controller, {
            source: this,
            cardType: 'character',
            cardCondition: card => card.location === 'play area' && card.fate > 0 && card.controller !== this.controller && !_.keys(targets).includes(card.uuid),
            onSelect: (player, card) => {
                let choices = _.range(1, Math.min(fateRemaining, card.fate) + 1);
                let handlers = _.map(choices, choice => {
                    return () => {
                        targets[card.uuid] = choice;
                        messages.push('take ' + choice.toString() + ' fate from ' + card.name);
                        this.consumedByFiveFiresChooseCard(context, targets, messages);
                    };
                });
                choices.push('Redo');
                handlers.push(() => {
                    this.consumedByFiveFiresChooseCard(context, {}, []);
                });
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'How much fate do you want to remove?',
                    choices: choices,
                    handlers: handlers,
                    source: this
                });
                return true;
            },
            onCancel: () => {
                this.game.addMessage('{0} chooses to: {1}', this.controller, messages);
                let keys = _.getKeys(targets);
                let events = this.game.applyGameAction(context, { removeFate: context.player.opponent.cardsInPlay.filter(card => keys.includes(card.uuid)) });
                _.each(events, event => event.fate = targets[event.card.uuid]);
                return true;
            }
        });
    }
}

ConsumedByFiveFires.id = 'consumed-by-five-fires'; 

module.exports = ConsumedByFiveFires;
