const _ = require('underscore');
const GameObject = require('./GameObject');
const Player = require('./player.js');
const Settings = require('../settings.js');
const { CardTypes, EffectNames, EventNames, Locations } = require('./Constants');

class Conflict extends GameObject {
    constructor(game, attackingPlayer, defendingPlayer, ring = null, conflictProvince = null, forcedDeclaredType = null) {
        super(game, 'Conflict');
        this.attackingPlayer = attackingPlayer;
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.forcedDeclaredType = forcedDeclaredType;
        this.declaredRing = this.ring = ring;
        this.declaredType = null;
        this.declarationComplete = false;
        this.defendersChosen = false;
        this.conflictProvince = conflictProvince;
        this.conflictPassed = false;
        this.conflictTypeSwitched = false;
        this.conflictUnopposed = false;
        this.winnerGoesStraightToNextConflict = false;
        this.attackerCardsPlayed = [];
        this.defenderCardsPlayed = [];
        this.attackers = [];
        this.attackerSkill = 0;
        this.defenders = [];
        this.defenderSkill = 0;
    }

    get conflictType() {
        return this.ring ? this.ring.conflictType : '';
    }

    get element() {
        return this.ring ? this.ring.element : '';
    }

    get maxAllowedDefenders() {
        let effects = this.getEffects(EffectNames.RestrictNumberOfDefenders);
        return effects.length === 0 ? -1 : Math.min(...effects);
    }

    getSummary() {
        return {
            attackingPlayerId: this.attackingPlayer.id,
            defendingPlayerId: this.defendingPlayer.id,
            attackerSkill: this.attackerSkill,
            defenderSkill: this.defenderSkill,
            type: this.conflictType,
            elements: this.elements,
            attackerWins: this.attackers.length > 0 && this.attackerSkill >= this.defenderSkill,
            breaking: this.conflictProvince && (this.conflictProvince.getStrength() - (this.attackerSkill - this.defenderSkill) <= 0),
            unopposed: !(this.defenders && this.defenders.length > 0),
            declarationComplete: this.declarationComplete,
            defendersChosen: this.defendersChosen
        };
    }

    setDeclarationComplete(value) {
        this.declarationComplete = value;
    }

    setDefendersChosen(value) {
        this.defendersChosen = value;
    }

    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ username: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
        if(this.conflictProvince) {
            this.conflictProvince.inConflict = false;
        }
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
        return this.sumEffects(EffectNames.ModifyConflictElementsToResolve) + 1;
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
            this.attackingPlayer.modifyFate(newRing.fate);
            newRing.fate = 0;
        }
        if(newRing.conflictType !== this.conflictType) {
            newRing.flipConflictType();
        }
        this.ring.resetRing();
        newRing.contested = true;
        this.ring = newRing;
    }

    checkForIllegalParticipants() {
        let illegal = this.attackers.filter(card => !card.canParticipateAsAttacker(this.conflictType));
        illegal = illegal.concat(this.defenders.filter(card => !card.canParticipateAsDefender(this.conflictType)));
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
        return this.attackers.concat(this.defenders).some(predicate);
    }

    getParticipants(predicate = () => true) {
        return this.attackers.concat(this.defenders).filter(predicate);
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

    getNumberOfParticipantsFor(player, predicate) {
        if(player === 'attacker') {
            player = this.attackingPlayer;
        } else if(player === 'defender') {
            player = this.defendingPlayer;
        }
        let characters = this.getCharacters(player);
        if(predicate) {
            return characters.filter(predicate).length;
        }
        return characters.length + player.sumEffects(EffectNames.AdditionalCharactersInConflict);
    }

    hasMoreParticipants(player, predicate) {
        if(!player) {
            return false;
        }
        if(!player.opponent) {
            return !!this.getNumberOfParticipantsFor(player, predicate);
        }
        return this.getNumberOfParticipantsFor(player) > this.getNumberOfParticipantsFor(player.opponent);
    }

    addCardPlayed(player, card) {
        if(player === this.attackingPlayer) {
            this.attackerCardsPlayed.push(card.createSnapshot());
        } else {
            this.defenderCardsPlayed.push(card.createSnapshot());
        }
    }

    getCardsPlayed(player, predicate = () => true) {
        if(player === this.attackingPlayer) {
            return this.attackerCardsPlayed.filter(predicate);
        }
        return this.defenderCardsPlayed.filter(predicate);
    }

    getNumberOfCardsPlayed(player, predicate) {
        if(!player) {
            return 0;
        }
        if(predicate) {
            return this.getCardsPlayed(player, predicate).length;
        }
        return player.sumEffects(EffectNames.AdditionalCardPlayed) + this.getCardsPlayed(player).length;
    }

    calculateSkill(prevStateChanged = false) {
        let stateChanged = this.game.effectEngine.checkEffects(prevStateChanged);

        if(this.winnerDetermined) {
            return stateChanged;
        }

        const contributingLocations = [
            Locations.PlayArea,
            Locations.ProvinceOne,
            Locations.ProvinceTwo,
            Locations.ProvinceThree,
            Locations.ProvinceFour,
            Locations.StrongholdProvince
        ];

        let additionalContributingCards = this.game.findAnyCardsInAnyList(card =>
            card.type === CardTypes.Character &&
            contributingLocations.includes(card.location) &&
            card.anyEffect(EffectNames.ContributeToConflict)
        );

        if(this.attackingPlayer.anyEffect(EffectNames.SetConflictTotalSkill)) {
            this.attackerSkill = this.attackingPlayer.mostRecentEffect(EffectNames.SetConflictTotalSkill);
        } else {
            let additionalAttackers = additionalContributingCards
                .filter(card => card.getEffects(EffectNames.ContributeToConflict).some(value => value === this.attackingPlayer));
            this.attackerSkill = this.calculateSkillFor(this.attackers.concat(additionalAttackers)) + this.attackingPlayer.skillModifier;
            if(this.attackingPlayer.imperialFavor === this.conflictType && this.attackers.length > 0) {
                this.attackerSkill++;
            }
        }

        if(this.defendingPlayer.anyEffect(EffectNames.SetConflictTotalSkill)) {
            this.defenderSkill = this.defendingPlayer.mostRecentEffect(EffectNames.SetConflictTotalSkill);
        } else {
            let additionalDefenders = additionalContributingCards
                .filter(card => card.getEffects(EffectNames.ContributeToConflict).some(value => value === this.defendingPlayer));
            this.defenderSkill = this.calculateSkillFor(this.defenders.concat(additionalDefenders)) + this.defendingPlayer.skillModifier;
            if(this.defendingPlayer.imperialFavor === this.conflictType && this.defenders.length > 0) {
                this.defenderSkill++;
            }
        }

        return stateChanged;
    }

    calculateSkillFor(cards) {
        let skillFunction = this.mostRecentEffect(EffectNames.ChangeConflictSkillFunction) || (card => card.getContributionToConflict(this.conflictType));
        let cannotContributeFunctions = this.getEffects(EffectNames.CannotContribute);
        return cards.reduce((sum, card) => {
            let cannotContribute = card.bowed;
            if(!cannotContribute) {
                cannotContribute = cannotContributeFunctions.some(func => func(card));
            }
            if(cannotContribute) {
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

        this.skillDifference = this.winnerSkill - this.loserSkill;
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    getCharacters(player) {
        if(!player) {
            return [];
        }
        return this.attackingPlayer === player ? this.attackers : this.defenders;
    }

    passConflict(message = '{0} has chosen to pass their conflict opportunity') {
        this.game.addMessage(message, this.attackingPlayer);
        this.conflictPassed = true;
        if(this.ring) {
            this.ring.resetRing();
        }
        this.game.recordConflict(this);
        this.game.currentConflict = null;
        this.game.raiseEvent(EventNames.OnConflictPass, { conflict: this });
        this.resetCards();
    }
}

module.exports = Conflict;
