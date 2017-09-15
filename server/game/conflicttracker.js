const _ = require('underscore');

class ConflictTracker {
    constructor() {
        this.complete = 0;
        this.conflictOpportunities = 2;
        this.conflictTypes = {
            military: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0,
                cannotInitiate: false
            },
            political: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0,
                cannotInitiate: false
            },
            defender: {
                performed: 0,
                won: 0,
                lost: 0,
                cannotInitiate: false
            },
            attacker: {
                performed: 0,
                won: 0,
                lost: 0,
                cannotInitiate: false
            }
        };
    }

    reset() {
        this.complete = 0;
        this.conflictOpportunities = 2;
        this.resetForType('military');
        this.resetForType('political');
        this.resetForType('defender');
        this.resetForType('attacker');

    }

    resetForType(conflictType) {
        this.conflictTypes[conflictType].performed = 0;
        this.conflictTypes[conflictType].won = 0;
        this.conflictTypes[conflictType].lost = 0;
    }

    isAtMax(conflictType) {
        if(!_.isUndefined(this.maxTotal) && this.complete >= this.maxTotal) {
            return true;
        }

        if(this.conflictTypes[conflictType].cannotInitiate) {
            return true;
        }

        return this.conflictTypes[conflictType].performed >= this.conflictTypes[conflictType].max;
    }

    getWon(conflictType) {
        return this.conflictTypes[conflictType].won;
    }

    getLost(conflictType) {
        return this.conflictTypes[conflictType].lost;
    }

    getPerformed(conflictType) {
        return this.conflictTypes[conflictType].performed;
    }

    setMax(max) {
        this.maxTotal = max;
    }

    clearMax() {
        delete this.maxTotal;
    }

    setCannotInitiateForType(conflictType, value) {
        this.conflictTypes[conflictType].cannotInitiate = value;
    }

    perform(conflictType, wasAttacker) {
        this.conflictTypes[conflictType].performed++;
        this.conflictTypes[wasAttacker ? 'attacker' : 'defender'].performed++;
        this.complete++;
    }

    won(conflictType, wasAttacker) {
        this.conflictTypes[conflictType].won++;
        this.conflictTypes[wasAttacker ? 'attacker' : 'defender'].won++;
    }

    lost(conflictType, wasAttacker) {
        this.conflictTypes[conflictType].lost++;
        this.conflictTypes[wasAttacker ? 'attacker' : 'defender'].lost++;
    }

    modifyMaxForType(conflictType, number) {
        this.conflictTypes[conflictType].max += number;
    }
    
    usedOpportunity() {
        this.conflictOpportunities--;
    }
}

module.exports = ConflictTracker;
