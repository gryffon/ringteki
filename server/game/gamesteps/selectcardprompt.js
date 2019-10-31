const _ = require('underscore');

const AbilityContext = require('../AbilityContext.js');
const CardSelector = require('../CardSelector.js');
const EffectSource = require('../EffectSource.js');
const UiPrompt = require('./uiprompt.js');

/**
 * General purpose prompt that asks the user to select 1 or more cards.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards the player
 *                      must select. Set to 0 if there is no limit on the num
 *                      of cards that can be selected.
 * multiSelect        - boolean that ensures that the selected cards are sent as
 *                      an array, even if the numCards limit is 1.
 * buttons            - array of buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * maxStat            - a function that returns the maximum value that cards
 *                      selected by the prompt cannot exceed. If not specified,
 *                      then no stat limiting is done on the prompt.
 * cardStat           - a function that takes a card and returns a stat value.
 *                      Used for prompts that have a maximum stat value.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * onSelect           - a callback that is called once all cards have been
 *                      selected. On single card prompts this is called as soon
 *                      as an elligible card is clicked. On multi-select prompts
 *                      it is called when the done button is clicked. If the
 *                      callback does not return true, the prompt is not marked
 *                      as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any cards.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * gameAction         - a GameAction object representing the game action to be checked on
 *                      target cards.
 * ordered            - an optional boolean indicating whether or not to display
 *                      the order of the selection during the prompt.
 * mustSelect         - an array of cards which must be selected
 */
class SelectCardPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        if(_.isString(properties.source)) {
            properties.source = new EffectSource(game, properties.source);
        } else if(properties.context && properties.context.source) {
            properties.source = properties.context.source;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }
        if(!properties.source) {
            properties.source = new EffectSource(game);
        }

        this.properties = properties;
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: properties.source });
        _.defaults(this.properties, this.defaultProperties());
        if(properties.gameAction) {
            if(!Array.isArray(properties.gameAction)) {
                this.properties.gameAction = [properties.gameAction];
            }
            let cardCondition = this.properties.cardCondition;
            this.properties.cardCondition = (card, context) =>
                cardCondition(card, context) && this.properties.gameAction.some(gameAction => gameAction.canAffect(card, context));
        }
        this.selector = properties.selector || CardSelector.for(this.properties);
        this.selectedCards = [];
        if(properties.mustSelect) {
            if(this.selector.hasEnoughSelected(properties.mustSelect) && this.selector.numCards > 0 && properties.mustSelect.length >= this.selector.numCards) {
                this.onlyMustSelectMayBeChosen = true;
            } else {
                this.selectedCards = [...properties.mustSelect];
                this.cannotUnselectMustSelect = true;
            }
        }
        this.savePreviouslySelectedCards();
    }

    defaultProperties() {
        return {
            buttons: [],
            controls: this.getDefaultControls(),
            selectCard: true,
            cardCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true
        };
    }

    getDefaultControls() {
        let targets = this.context.targets ? Object.values(this.context.targets) : [];
        targets = targets.reduce((array, target) => array.concat(target), []);
        if(targets.length === 0 && this.context.event && this.context.event.card) {
            this.targets = [this.context.event.card];
        }
        return [{
            type: 'targeting',
            source: this.context.source.getShortSummary(),
            targets: targets.map(target => target.getShortSummaryForControls(this.choosingPlayer))
        }];
    }

    savePreviouslySelectedCards() {
        this.previouslySelectedCards = this.choosingPlayer.selectedCards;
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.setSelectedCards(this.selectedCards);
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        this.choosingPlayer.setSelectableCards(this.selector.findPossibleCards(this.context).filter(card => this.checkCardCondition(card)));
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = this.properties.buttons;
        if(!this.selector.automaticFireOnSelect() && this.selector.hasEnoughSelected(this.selectedCards) || this.selector.optional) {
            if(buttons.every(button => button.arg !== 'done')) {
                buttons = [{ text: 'Done', arg: 'done' }].concat(buttons);
            }
        }
        if(this.game.manualMode && buttons.every(button => button.arg !== 'cancel')) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            selectCard: this.properties.selectCard,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.selector.defaultActivePromptTitle(),
            buttons: buttons,
            promptTitle: this.properties.source ? this.properties.source.name : undefined,
            controls: this.properties.controls
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(this.selector.automaticFireOnSelect() && this.selector.hasReachedLimit(this.selectedCards)) {
            this.fireOnSelect();
        }
    }

    checkCardCondition(card) {
        if(this.onlyMustSelectMayBeChosen && !this.properties.mustSelect.includes(card)) {
            return false;
        } else if(this.selectedCards.includes(card)) {
            return true;
        }

        return (
            this.selector.canTarget(card, this.context, this.choosingPlayer) &&
            !this.selector.wouldExceedLimit(this.selectedCards, card)
        );
    }

    selectCard(card) {
        if(this.selector.hasReachedLimit(this.selectedCards) && !this.selectedCards.includes(card)) {
            return false;
        } else if(this.cannotUnselectMustSelect && this.properties.mustSelect.includes(card)) {
            return false;
        }

        if(!this.selectedCards.includes(card)) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards = _.reject(this.selectedCards, c => c === card);
        }
        this.choosingPlayer.setSelectedCards(this.selectedCards);

        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect() {
        let cardParam = this.selector.formatSelectParam(this.selectedCards);
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
            return true;
        }
        this.clearSelection();
        return false;
    }

    menuCommand(player, arg) {
        if(arg === 'cancel') {
            this.properties.onCancel(player);
            this.complete();
            return true;
        } else if(arg === 'done' && this.selector.hasEnoughSelected(this.selectedCards)) {
            return this.fireOnSelect();
        } else if(this.properties.onMenuCommand(player, arg)) {
            this.complete();
            return true;
        }
        return false;
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.selectedCards = [];
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
        this.choosingPlayer.clearSelectableRings();

        // Restore previous selections.
        this.choosingPlayer.setSelectedCards(this.previouslySelectedCards);
    }
}

module.exports = SelectCardPrompt;
