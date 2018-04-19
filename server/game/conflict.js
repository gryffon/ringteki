const _ = require('underscore');
const Player = require('./player.js');
const Settings = require('../settings.js');

class Conflict {
    constructor(game, attackingPlayer, defendingPlayer, ring = null, conflictProvince = null) {
        this.game = game;
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.declaredRing = this.ring = ring;
        this.conflictProvince = conflictProvince;
        this.conflictPassed = false;
        this.conflictTypeSwitched = false;
        this.conflictUnopposed = false;
        this.winnerGoesStraightToNextConflict = false;
        this.attackers = [];
        this.attackerSkill = 0;
        this.defenders = [];
        this.defenderSkill = 0;
        this.effects = [];
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    removeEffect(effect) {
        this.effects = this.effects.filter(e => e !== effect);
    }

    getEffects(type) {
        let filteredEffects = this.effects.filter(effect => effect.type === type);
        return filteredEffects.map(effect => effect.getValue(this));
    }

    get type() {
        return this.ring ? this.ring.conflictType : '';
    }

    get element() {
        return this.ring ? this.ring.element : '';
    }

    get maxAllowedDefenders() {
        let effects = this.getEffects('restrictNumberOfDefenders');
        return effects.length === 0 ? -1 : Math.min(...effects);
    }
        
    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ username: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
        if(this.ring) {
            this.ring.resetRing();
            this.ring = null;
        }
        if(this.conflictProvince) {
            this.conflictProvince.inConflict = false;
        }
    }

    initiateConflict() {
        this.attackingPlayer.initiateConflict(this.type);
    }

    addAttackers(attackers) {
        attackers = _.reject(attackers, card => this.isAttacking(card));
        if(attackers.length > 0) {
            this.attackers = this.attackers.concat(attackers);
            this.markAsParticipating(attackers);
        }
    }

    addAttacker(attacker) {
        if(this.attackers.includes(attacker)) {
            return;
        }
        this.attackers.push(attacker);
        this.markAsParticipating([attacker]);
    }

    addDefenders(defenders) {
        defenders = _.reject(defenders, card => this.isDefending(card));
        if(defenders.length > 0) {
            this.defenders = this.defenders.concat(defenders);
            this.markAsParticipating(defenders);
        }
    }

    addDefender(defender) {
        if(this.defenders.includes(defender)) {
            return;
        }
        this.defenders.push(defender);
        this.markAsParticipating([defender]);
    }
            
    
    hasElement(element) {
        return this.elements.includes(element);
    }
    
    get elements() {
        return this.ring ? this.ring.getElements() : [];
    }

    get elementsToResolve() {
        return this.getEffects('modifyConflictElementsToResolve').reduce((total, value) => total + value, 1);
    }
    
    resolveRing(player = this.attackingPlayer, optional = true) {
        this.game.raiseEvent('onResolveRingEffect', { player: player, conflict: this }, () => {
            if(this.elements.length === 1 || (!optional && this.elementsToResolve >= this.elements.length)) {
                player.resolveRingEffects(this.elements, optional);
            } else {
                this.chooseElementsToResolve(player, this.elements, optional);
            }
        });
    }

    chooseElementsToResolve(player, elements, optional = true, elementsToResolve = this.elementsToResolve, chosenElements = []) {
        if(elements.length === 0 || elementsToResolve === 0) {
            player.resolveRingEffects(chosenElements, optional);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve';
        if(chosenElements.length > 0) {
            activePromptTitle = _.reduce(chosenElements, (string, element) => string + ' ' + element, activePromptTitle + '\nChosen elements:');
        }
        let buttons = [];
        if(optional) {
            if(chosenElements.length > 0 && optional) {
                buttons.push({ text: 'Done', arg: 'done' });
            }
            if(elementsToResolve >= elements.length) {
                buttons.push({ text: 'Resolve All Elements', arg: 'all' });
            }
            buttons.push({ text: 'Don\'t Resolve the Conflict Ring', arg: 'cancel' });
        }
        this.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            buttons: buttons,
            source: 'Resolve Ring Effect',
            ringCondition: ring => elements.includes(ring.element),
            onSelect: (player, ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(player, _.without(elements, ring.element), optional, elementsToResolve, chosenElements);
                return true;
            },
            onCancel: player => this.game.addMessage('{0} chooses not to resolve {1}', player, this.ring),
            onMenuCommand: (player, arg) => {
                if(arg === 'all') {
                    player.resolveRingEffects(this.elements);
                } else if(arg === 'done') {
                    player.resolveRingEffects(chosenElements, optional);
                }
                return true;
            }
        });
    }

    switchType() {
        this.ring.flipConflictType();
        this.conflictTypeSwitched = true;
    }
    
    switchElement(element) {
        let newRing = this.game.rings[element];
        if(!newRing) {
            throw new Error('switchElement called for non-existant element');
        }
        if(this.attackingPlayer.allowGameAction('takeFateFromRings') && newRing.fate > 0) {
            this.game.addMessage('{0} takes {1} fate from {2}', this.attackingPlayer, newRing.fate, newRing);
            this.game.addFate(this.attackingPlayer, newRing.fate);
            newRing.fate = 0;
        }
        if(newRing.conflictType !== this.type) {
            newRing.flipConflictType();
        }
        this.ring.resetRing();
        newRing.contested = true;
        this.ring = newRing;
    }
    
    checkForIllegalParticipants() {
        let illegal = this.attackers.filter(card => !card.canParticipateAsAttacker(this.type));
        illegal = illegal.concat(this.defenders.filter(card => !card.canParticipateAsDefender(this.type)));
        if(illegal.length > 0) {
            this.game.addMessage('{0} cannot participate in the conflict any more and {1} sent home bowed', illegal, illegal.length > 1 ? 'are' : 'is');
            this.game.applyGameAction(null, { sendHome: illegal, bow: illegal });
        }
    }

    removeFromConflict(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);

        card.inConflict = false;
    }

    markAsParticipating(cards) {
        _.each(cards, card => {
            card.inConflict = true;
        });
    }

    isAttacking(card) {
        return this.attackers.includes(card);
    }

    isDefending(card) {
        return this.defenders.includes(card);
    }

    isParticipating(card) {
        return this.isAttacking(card) || this.isDefending(card);
    }

    anyParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return _.any(participants, predicate);
    }

    getNumberOfParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return _.reduce(participants, (count, card) => {
            if(predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    calculateSkill(stateChanged = false) {
        stateChanged = this.game.effectEngine.checkEffects(stateChanged);

        if(this.winnerDetermined) {
            return stateChanged;
        }

        let additionalCharacters = this.getEffects('contribute');
        let additionalAttackers = additionalCharacters.filter(card => card.controller === this.attackingPlayer);
        let additionalDefenders = additionalCharacters.filter(card => card.controller === this.defendingPlayer);
        this.attackerSkill = this.calculateSkillFor(this.attackers.concat(additionalAttackers));
        this.defenderSkill = this.calculateSkillFor(this.defenders.concat(additionalDefenders));
        
        if(this.attackingPlayer.imperialFavor === this.type && this.attackers.length > 0) {
            this.attackerSkill++;
        } else if(this.defendingPlayer.imperialFavor === this.type && this.defenders.length > 0) {
            this.defenderSkill++;
        }
        return stateChanged;
    }

    calculateSkillFor(cards) {
        let skillFunction = _.last(this.getEffects('skillFunction')) || (card => card.getSkill(this.type));
        return _.reduce(cards, (sum, card) => {
            if(card.bowed || !card.allowGameAction('countForResolution')) {
                return sum;
            }
            return sum + skillFunction(card);
        }, 0);
    }

    determineWinner() {
        this.calculateSkill();
        this.winnerDetermined = true;

        if(this.attackerSkill === 0 && this.defenderSkill === 0) {
            this.loser = undefined;
            this.winner = undefined;
            this.loserSkill = this.winnerSkill = 0;
            this.skillDifference = 0;
            return;
        }
        if(this.attackerSkill >= this.defenderSkill) {
            this.loser = this.defendingPlayer;
            this.loserSkill = this.defenderSkill;
            this.winner = this.attackingPlayer;
            this.winnerSkill = this.attackerSkill;
        } else {
            this.loser = this.attackingPlayer;
            this.loserSkill = this.attackerSkill;
            this.winner = this.defendingPlayer;
            this.winnerSkill = this.defenderSkill;
        }

        this.winner.winConflict(this.type, this.attackingPlayer === this.winner);
        this.loser.loseConflict(this.type, this.attackingPlayer === this.loser);
        this.skillDifference = this.winnerSkill - this.loserSkill;
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    getOpponentCards(player) {
        return this.attackingPlayer === player ? this.defenders : this.attackers;
    }

    passConflict(message = '{0} has chosen to pass their conflict opportunity') {
        this.game.addMessage(message, this.attackingPlayer);
        this.conflictPassed = true;
        this.attackingPlayer.conflicts.usedConflictOpportunity();
        this.game.raiseEvent('onConflictPass', { conflict: this });

        this.resetCards();

    }
}

module.exports = Conflict;
