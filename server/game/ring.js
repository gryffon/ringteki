const _ = require('underscore');
const EffectSource = require('./EffectSource');
const { EffectNames } = require('./Constants');

class Ring extends EffectSource {
    constructor(game, element, type) {
        super(game, element.replace(/\b\w/g, l => l.toUpperCase()) + ' Ring');
        this.type = 'ring';
        this.claimed = false;
        this.claimedBy = '';
        this.conflictType = type;
        this.contested = false;
        this.element = element;
        this.fate = 0;
        this.attachments = [];

        this.menu = _([
            { command: 'flip', text: 'Flip' },
            { command: 'claim', text: 'Claim' },
            { command: 'contested', text: 'Switch this ring to contested' },
            { command: 'unclaimed', text: 'Set to unclaimed' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'takefate', text: 'Take all fate' },
            { command: 'conflict', text: 'Initiate Conflict' }
        ]);
    }

    isConsideredClaimed(player = null) {
        let check = player => (this.getEffects(EffectNames.ConsiderRingAsClaimed).some(match => match(player)) || this.claimedBy === player.name);
        if(player) {
            return check(player);
        }
        return this.game.getPlayers().some(player => check(player));
    }

    isConflictType(type) {
        return !this.isUnclaimed() && type === this.conflictType;
    }

    canDeclare(player) {
        return !this.getEffects(EffectNames.CannotDeclareRing).some(match => match(player)) && !this.claimed;
    }

    isUnclaimed() {
        return !this.contested && !this.claimed;
    }

    flipConflictType() {
        if(this.conflictType === 'military') {
            this.conflictType = 'political';
        } else {
            this.conflictType = 'military';
        }
    }

    getElements() {
        let elements = this.getEffects(EffectNames.AddElement).concat([this.element]);
        if(this.game.isDuringConflict()) {
            elements = elements.concat(...this.game.currentConflict.attackers.map(card =>
                card.attachments.reduce(
                    (array, attachment) => array.concat(attachment.getEffects(EffectNames.AddElementAsAttacker)),
                    card.getEffects(EffectNames.AddElementAsAttacker)
                )
            ));
        }
        return _.uniq(_.flatten(elements));
    }

    hasElement(element) {
        return this.getElements().includes(element);
    }

    getFate() {
        return this.fate;
    }

    getMenu() {
        var menu = [];

        if(this.menu.isEmpty() || !this.game.manualMode) {
            return undefined;
        }

        menu.push({ command: 'click', text: 'Select Ring' });
        menu = menu.concat(this.menu.value());

        return menu;
    }

    /**
     * @param {Number} fate - the amount of fate to modify this card's fate total by
     */
    modifyFate(fate) {
        this.fate = Math.max(this.fate + fate, 0);
    }

    removeFate() {
        this.fate = 0;
    }

    claimRing(player) {
        this.claimed = true;
        this.claimedBy = player.name;
    }

    resetRing() {
        this.claimed = false;
        this.claimedBy = '';
        this.contested = false;
    }

    getState(activePlayer) {

        let selectionState = {};

        if(activePlayer) {
            selectionState = activePlayer.getRingSelectionState(this);
        }

        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            contested: this.contested,
            selected: this.game.currentConflict && this.game.currentConflict.conflictRing === this.element,
            element: this.element,
            fate: this.fate,
            menu: this.getMenu(),
            attachments: this.attachments.length 
                ? this.attachments.map(attachment => attachment.getSummary(activePlayer, true))
                : this.attachments
        };

        return Object.assign(state, selectionState);
    }

    getShortSummary(card) {
        return Object.assign(super.getShortSummary(), { element: this.element, conflictType: this.conflictType });
    }
}

module.exports = Ring;
