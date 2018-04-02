const _ = require('underscore');

const BaseStep = require('./basestep.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class ForcedTriggeredAbilityWindow extends BaseStep {
    constructor(game, abilityType, events) {
        super(game);
        this.choices = [];
        this.events = events;
        this.abilityType = abilityType;        
        this.currentPlayer = this.game.getFirstPlayer();
        this.abilitiesTriggered = [];
    }

    continue() {
        this.game.currentAbilityWindow = this;
        if(this.events.length > 0) {
            this.emitEvents();
        }

        if(this.filterChoices()) {
            this.game.currentAbilityWindow = null;
            return true;
        }

        return false;
    }

    addChoice(context) {
        if(!this.abilitiesTriggered.includes(context.ability)) {
            this.choices.push(context);
        }
    }

    filterChoices() {
        if(this.choices.length === 0) {
            return true;
        }
        if(this.choices.length === 1) {
            this.resolveAbility(this.choices[0]);
            return false;
        }
        let cards = _.uniq(this.choices, context => context.source);
        if(cards.length === 1) {
            this.promptBetweenChoices(this.choices);
        } else {
            this.game.promptForSelect(this.currentPlayer, this.getPromptForSelectProperties());
        }
        return false;
    }

    getPromptForSelectProperties() {
        let cards = _.pluck(this.choices, 'source');
        return {
            source: 'Triggered Abilities',
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
            waitingPromptTitle: 'Waiting for opponent',
            cardCondition: card => cards.includes(card),
            onSelect: (player, card) => {
                let choices = _.filter(this.choices, context => context.source === card);
                // The card chosen corresponds to a single event/ability combination
                if(choices.length === 1) {
                    this.resolveAbility(choices[0]);
                    return true;
                }
                // The card chosen has multiple abilities which can be used in this window - no cards can have multiple reaction abilities at the moment
                // The card chosen has a single ability which can be used with multiple events in this window
                // Differentiate between events by Event.card
                let eventCards = _.map(choices, context => context.event.card);
                this.game.promptForSelect(player, {
                    source: 'Triggered Abilities',
                    activePromptTitle: 'Choose a card',
                    waitingPromptTitle: 'Waiting for opponent',
                    cardCondition: card => eventCards.includes(card),
                    onSelect: (player, card) => {
                        choices = _.filter(choices, context => context.event.card === card);
                        if(choices.length === 1) {
                            this.resolveAbility(choices[0]);
                            return true;
                        }
                        // Differentiate between events by Event.name
                        this.promptBetweenChoices(choices);
                        return true;
                    }
                });
                return true;
            }
        }
    }

    promptBetweenChoices(choices) {
        this.game.promptWithHandlerMenu(this.currentPlayer, {
            source: 'Triggered Abilities',
            activePromptTitle: 'Which event do you want to respond to?',
            waitingPromptTitle: 'Waiting for opponent',
            choices: _.map(choices, context => TriggeredAbilityWindowTitles.getAction(context.event)),
            handlers: _.map(choices, context => {
                return () => {
                    this.resolveAbility(context);
                };
            })
        });
    }

    resolveAbility(context) {
        this.game.resolveAbility(context);
        this.abilitiesTriggered.push(context.ability);
    }

    emitEvents() {
        this.choices = [];
        _.each(this.events, event => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
    }
}

module.exports = ForcedTriggeredAbilityWindow;
