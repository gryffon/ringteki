const _ = require('underscore');
const UiPrompt = require('../uiprompt.js');
const { Locations, CardTypes, EffectNames } = require('../../Constants');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class InitiateConflictPrompt extends UiPrompt {
    constructor(game, conflict, choosingPlayer, attackerChoosesRing = true, canPass = attackerChoosesRing) {
        super(game);
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.attackerChoosesRing = attackerChoosesRing;
        this.canPass = canPass;
        this.selectedDefenders = [];
        this.covertRemaining = false;
        this.checkForMustSelect();
        this.choosingPlayer.promptState.setIsConflictInitiation();
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    getMustBeDeclared() {
        return this.choosingPlayer.cardsInPlay.filter(card =>
            card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some(effect => effect === 'both' || effect === this.conflict.conflictType));
    }

    checkForMustSelect() {
        for(const card of this.getMustBeDeclared()) {
            if(this.checkCardCondition(card) && !this.conflict.attackers.includes(card)) {
                this.selectCard(card);
            }
        }
    }

    highlightSelectableRings() {
        let selectableRings = _.filter(this.game.rings, ring => {
            return this.checkRingCondition(ring);
        });
        this.choosingPlayer.setSelectableRings(selectableRings);
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [];
        let menuTitle = '';
        let promptTitle = '';

        if(this.canPass) {
            buttons.push({ text: 'Pass Conflict', arg: 'pass' });
        }

        if(!this.conflict.ring) {
            menuTitle = this.conflict.forcedDeclaredType ? 'Choose an elemental ring' : 'Choose an elemental ring\n(click the ring again to change conflict type)';
            promptTitle = 'Initiate Conflict';
        } else {
            promptTitle = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' Conflict';
            if(!this.conflict.conflictProvince && !this.conflict.isSinglePlayer) {
                menuTitle = 'Choose province to attack';
            } else if(this.conflict.attackers.length === 0) {
                menuTitle = 'Choose attackers';
            } else {
                if(this.covertRemaining) {
                    menuTitle = 'Choose defenders to Covert';
                } else {
                    menuTitle = capitalize[this.conflict.conflictType] + ' skill: '.concat(this.conflict.attackerSkill);
                }
                buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
            }
        }

        return {
            selectRing: true,
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to declare conflict' };
    }

    onCardClicked(player, card) {
        return player === this.choosingPlayer && this.checkCardCondition(card) && this.selectCard(card);
    }

    onRingClicked(player, ring) {
        return player === this.choosingPlayer && this.checkRingCondition(ring) && this.selectRing(ring);
    }

    selectRing(ring) {
        let player = this.choosingPlayer;

        if(this.conflict.ring === ring) {
            ring.flipConflictType();
        } else {
            const type = ring.conflictType;
            if(!player.hasLegalConflictDeclaration({ type, ring, province: this.conflict.conflictProvince })) {
                ring.flipConflictType();
            } else if(this.conflict.attackers.some(card => !card.canDeclareAsAttacker(type, ring))) {
                ring.flipConflictType();
            }
            if(this.conflict.ring) {
                this.conflict.ring.resetRing();
            }
            this.conflict.ring = ring;
            ring.contested = true;
        }

        _.each(this.conflict.attackers, card => {
            if(!card.canDeclareAsAttacker(ring.conflictType, ring)) {
                this.removeFromConflict(card);
            }
        });

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    checkRingCondition(ring) {
        const player = this.choosingPlayer;
        const province = this.conflict.conflictProvince;
        if(this.conflict.ring === ring) {
            const newType = ring.conflictType === 'military' ? 'political' : 'military';
            if(!player.hasLegalConflictDeclaration({ type: newType, ring, province })) {
                return false;
            }
            const mustBeDeclaredAttackers = this.getMustBeDeclared().filter(card => card.inConflict);
            return mustBeDeclaredAttackers.every(card =>
                card.canDeclareAsAttacker(newType, ring, province) &&
                player.hasLegalConflictDeclaration({ type: newType, ring, province })
            );
        }
        return this.attackerChoosesRing && player.hasLegalConflictDeclaration({ ring, province });
    }

    checkCardCondition(card) {
        if(card.isProvince && card.controller !== this.choosingPlayer) {
            return card === this.conflict.conflictProvince || this.choosingPlayer.hasLegalConflictDeclaration({
                type: this.conflict.conflictType,
                ring: this.conflict.ring,
                province: card
            });
        } else if(card.type === CardTypes.Character && card.location === Locations.PlayArea) {
            if(card.controller === this.choosingPlayer) {
                if(this.conflict.attackers.includes(card)) {
                    return !card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some(effect => effect === 'both' || effect === this.conflict.conflictType);
                }
                return this.choosingPlayer.hasLegalConflictDeclaration({
                    type: this.conflict.conflictType,
                    ring: this.conflict.ring,
                    province: this.conflict.province,
                    attacker: card
                });
            }
            return this.selectedDefenders.includes(card) || !card.isCovert() && this.covertRemaining;
        }
        return false;
    }

    recalculateCovert() {
        let attackersWithCovert = _.size(_.filter(this.conflict.attackers, card => card.isCovert()));
        this.covertRemaining = attackersWithCovert > _.size(this.selectedDefenders);
    }

    selectCard(card) {
        if(card.isProvince) {
            if(this.conflict.conflictProvince) {
                this.conflict.conflictProvince.inConflict = false;
                this.conflict.conflictProvince = null;
            } else {
                this.conflict.conflictProvince = card;
                this.conflict.conflictProvince.inConflict = true;
            }
        } else if(card.type === CardTypes.Character) {
            if(card.controller === this.choosingPlayer) {
                if(!this.conflict.attackers.includes(card)) {
                    this.conflict.addAttacker(card);
                } else {
                    this.removeFromConflict(card);
                }
            } else {
                if(!this.selectedDefenders.includes(card)) {
                    this.selectedDefenders.push(card);
                    card.covert = true;
                } else {
                    this.selectedDefenders = _.reject(this.selectedDefenders, c => c === card);
                    card.covert = false;
                }
            }
        }

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    removeFromConflict(card) {
        if(card.isCovert() && !this.covertRemaining) {
            this.selectedDefenders.pop().covert = false;
        }
        this.conflict.removeFromConflict(card);
    }

    menuCommand(player, arg) {
        if(arg === 'done') {
            if(!this.conflict.ring || this.game.rings[this.conflict.element] !== this.conflict.ring ||
                                (!this.conflict.isSinglePlayer && !this.conflict.conflictProvince) || this.conflict.attackers.length === 0) {
                return false;
            }
            this.conflict.setDeclarationComplete(true);
            this.complete();
            this.conflict.declaredRing = this.conflict.ring;
            this.conflict.declaredType = this.conflict.ring.conflictType;
            return true;
        } else if(arg === 'pass') {
            this.game.promptWithHandlerMenu(this.choosingPlayer, {
                activePromptTitle: 'Are you sure you want to pass your conflict opportunity?',
                source: 'Pass Conflict',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.complete();
                        this.conflict.passConflict();
                    },
                    () => true
                ]
            });
            return true;
        }
        return false;
    }
}

module.exports = InitiateConflictPrompt;
