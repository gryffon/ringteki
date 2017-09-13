const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Conflict = require('../conflict.js');
const ConflictFlow = require('./conflict/conflictflow.js');
const ActionWindow = require('./actionwindow.js');

/*
III Conflict Phase
3.1 Conflict phase begins.
    ACTION WINDOW
    NOTE: After this action window, if no conflict
    opporunities remain, proceed to (3.4).
3.2 Next player in player order declares a 
    conflict(go to Conflict Resolution), or passes
    (go to 3.3).
3.3 Conflict Ends/Conflict was passed. Return to 
    the action window following step (3.1).
3.4 Determine Imperial Favor.
3.4.1 Glory count.
3.4.2 Claim Imperial Favor.
3.5 Conflict phase ends.

 */

class ConflictPhase extends Phase {
    constructor(game) {
        super(game, 'conflict');
        this.gloryTotals = [];
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new ActionWindow(this.game, 'Before conflicts', 'conflictBegin'),
            new SimpleStep(this.game, () => this.newConflict())
        ]);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.currentPlayer = this.remainingPlayers[0];
    }
    
    newConflict() {
        let conflictOpportunityRemaining = true;
        
        if (_.all(['military', 'political'], type => !this.currentPlayer.canInitiateConflict(type))) {
            this.currentPlayer = this.game.getOtherPlayer(this.currentPlayer);
            if (_.all(['military', 'political'], type => this.currentPlayer.canInitiateConflict(type))) {
                let conflictOpportunityRemaining = false;    
            } 
        }
        
        if (conflictOpportunityRemaining) {
            this.currentPlayer.conflicts.usedOpportunity();
            var conflict = new Conflict(this.game, this.currentPlayer, this.game.getOtherPlayer(this.currentPlayer));
            this.game.currentConflict = conflict;
            this.game.queueStep(new ConflictFlow(this.game, conflict));
            this.game.queueStep(new SimpleStep(this.game, () => this.cleanupConflict()));
        } else {
            this.game.queueStep(new SimpleStep(this.game, () => this.determineImperialFavor()));
            this.game.queueStep(new SimpleStep(this.game, () => this.countGlory()));
            this.game.queueStep(new SimpleStep(this.game, () => this.claimImperialFavor()));            
        }
    }
    
    determineImperialFavor() {
        this.game.raiseEvent('onDetermineImperialFavor');
    }
    
    countGlory() {
        this.glorytotals = _.map(this.game.getPlayersInFirstPlayerOrder(), player => {
            rings = player.getClaimedRings();
            return {player: player, glory: player.getFavor() + rings.length};
        });
    }
    
    claimImperialFavor() {
        if (this.glorytotals[0].glory === this.glorytotals[1].glory) {
            this.game.addMessage('Both players are tied in glory at {0}.  The imperial favor remains in its current state', this.glorytotals[0].glory);
            this.game.raiseEvent('onFaviorGloryTied', glorytotals[0].glory);
        } else {
            let winner = _.max(this.glorytotals, tuplet => tuplet.player);
            this.game.promptWithMenu(winner, this, {
                activePrompt: {
                    menuTitle: 'Which side of the Imperial Favor would you like to claim?',
                    buttons: [
                        { text: 'Military', method: 'giveImperialFavorToPlayer', arg: 'military' },
                        { text: 'Political', method: 'giveImperialFavorToPlayer', arg: 'political' }
                    ]
                }
            });
        }
    }
    
    giveImperialFavorToPlayer(arg) {
        let winner = _.max(this.glorytotals, tuplet => tuplet.player);
        this.game.raiseEvent('onClaimImperialFavor', arg, winner.claimImperialFavor);
    }

    startConflictChoice(attackingPlayer = null) {
        let attacker = attackingPlayer;
        if(attacker === null) {
            attacker = this.currentPlayer;
        }

        this.game.queueStep(new SimpleStep(this.game, () => this.promptForConflictType(attacker)));

    }

    promptForConflictType(attackingPlayer) {
        if(this.remainingPlayers.length === 0) {
            return true;
        }

        let currentPlayer = attackingPlayer;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Military', method: 'promptForConflictRing', arg: 'military' },
                    { text: 'Political', method: 'promptForConflictRing', arg: 'political' },
                    { text: 'Pass', method: 'passConflict' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to initiate conflict'
        });

        return false;
    }

    promptForConflictRing(attackingPlayer, conflictType) {
        let currentPlayer = attackingPlayer;

        this.conflictType = conflictType;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Air', method: 'promptForConflictProvince', arg: 'air' },
                    { text: 'Earth', method: 'promptForConflictProvince', arg: 'earth' },
                    { text: 'Fire', method: 'promptForConflictProvince', arg: 'fire' },
                    { text: 'Void', method: 'promptForConflictProvince', arg: 'void' },
                    { text: 'Water', method: 'promptForConflictProvince', arg: 'water' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to choose conflict ring'
        });

        return false;
    }

    promptForConflictProvince(attackingPlayer, conflictRing) {
        var currentPlayer = attackingPlayer;

        this.conflictRing = conflictRing;
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Stronghold', method: 'initiateConflict', arg: 'stronghold province' },
                    { text: 'One', method: 'initiateConflict', arg: 'province 1' },
                    { text: 'Two', method: 'initiateConflict', arg: 'province 2' },
                    { text: 'Three', method: 'initiateConflict', arg: 'province 3' },
                    { text: 'Four', method: 'initiateConflict', arg: 'province 4' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to choose province'
        });

        return false;
    }

    initiateConflict(attackingPlayer, conflictProvince) {
        if(!attackingPlayer.canInitiateConflict(this.conflictType)) {
            return;
        }

        attackingPlayer.conflictType = this.conflictType;

        let defendingPlayer = this.chooseOpponent(attackingPlayer);

        var conflict = new Conflict(this.game, attackingPlayer, defendingPlayer, this.conflictType, this.conflictRing, conflictProvince);
        this.game.currentConflict = conflict;
        this.game.queueStep(new ConflictFlow(this.game, conflict));
        this.game.queueStep(new SimpleStep(this.game, () => this.cleanupConflict()));
    }

    cleanupConflict() {
        this.game.currentConflict.unregisterEvents();
        this.game.currentConflict = null;
        this.currentPlayer = this.game.getOtherPlayer(this.currentPlayer);
    }

    chooseOpponent(attackingPlayer) {
        return this.game.getOtherPlayer(attackingPlayer);
    }

    passConflict(player) {
        let otherPlayer = this.game.getOtherPlayer(player);
        let attacker = otherPlayer;

        if(typeof otherplayer === 'undefined') {
            attacker = player;
        }
        
        this.game.addMessage('{0} has passed the opportunity to declare a conflict', player);

        this.game.queueStep(new SimpleStep(this.game, () => this.startConflictChoice(attacker)));
        return true;
    }

    completeConflicts(player) {
        this.game.addMessage('{0} has finished their conflicts', player);

        this.remainingPlayers.shift();
        return true;
    }
}

module.exports = ConflictPhase;
