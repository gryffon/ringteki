const _ = require('underscore');
const SelectCardPrompt = require('../selectcardprompt.js');

class InitiateConflictPrompt extends SelectCardPrompt {
    constructor(game, conflict, choosingPlayer) {
        super(game);
        
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.attackersSelected = [];
        this.defendersSelected = [];
        this.provinceSelected = null;
        this.covertRemaining = false;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        let selectableCards = this.game.allCards.filter(card => {
            return this.checkCardCondition(card);
        });
        this.choosingPlayer.setSelectableCards(selectableCards);
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [{ text: 'Pass', arg: 'pass' }];
        let menuTitle = '';
        let promptTitle = '';
        
        if (this.conflict.conflictRing === '') {
            let menuTitle = 'Choose an elemental ring';
            let promptTitle = 'Initiate Conflict';
        } else {
            let promptTitle = ('{0} {1} Conflict', this.conflict.conflictType, this.conflict.conflictRing);
            if (!this.conflict.conflictProvince){
                    let menuTitle = 'Choose province to attack';
            } else if (this.attackersSelected.length === 0) {
                let menuTitle = 'Choose attackers';
            } else {
                if (this.covertRemaining) {
                    let menuTitle = 'Choose defenders to Covert';
                } else {
                    let menuTitle = 'Click Done to declare conflict';
                }
                buttons.unshift({ text: 'Done', arg: 'done' });
            }
        }
        
        return {
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent to declare conflict' };
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

    }

    checkCardCondition(card) {
        if (card.isProvince && card.controller !== this.choosingPlayer && !card.isBroken) {
            if (!this.provinceSelected || card === this.provinceSelected) {
                return true;
            }
        } else if (card.type === 'character') {
            if (card.controller === this.choosingPlayer) {
                if (card.canDeclareAsParticipant(this.conflict.conflictType) && card.canDeclareAsAttacker()) {
                    return true;
                }
            } else if (card.canBeBypassedByCovert() && this.covertRemaining) {
                return true;
            }
        }
        return false;
    }

    selectCard(card) {
        if (card.isProvince) {
            this.province = (card === this.provinceSelected) ? null : card;
        } else if (card.type === 'character') {
            if (card.controller === this.choosingPlayer) {
                if (!this.selectedAttackers.includes(card)) {
                    this.selectedAttackers.push(card);
                } else {
                    this.selectedAttackers = _.reject(this.selectedAttackers, c => c === card);
                }
            } else {
                if (!this.selectedDefenders.includes(card)) {
                    this.selectedDefenders.push(card);
                } else {
                    this.selectedDefenders = _.reject(this.selectedDefenders, c => c === card);
                }         
            }
            this.recalculateCovert();
        }

        this.choosingPlayer.setSelectedCards(this.selectedCards);
        
        /*
        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }
        */
       
        return true;
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(arg === 'done') {
            this.conflict.conflictDeclared = true;
        } else if (arg === 'pass') {
            this.conflict.passed = true;
            this.game.raiseEvent('onConflictPass',this.conflict,this.conflict.cancelConflict);
        }
        
        this.complete();
    }
    
    complete() {
        this.conflict.attackers = this.selectedAttackers;
        _.each(this.selectedDefenders, card => {
            card.stealth = true;
        });
        this.conflict.conflictProvince = this.selectedProvince;
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = InitiateConflictPrompt;



