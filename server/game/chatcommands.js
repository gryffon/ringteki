const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');
const HonorBidPrompt = require('./gamesteps/honorbidprompt.js');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/draw': this.draw,
            '/honor': this.honor,
            '/dishonor': this.dishonor,
            '/blank': this.blank,
            '/unblank': this.unblank,
            '/add-trait': this.addTrait,
            '/remove-trait': this.removeTrait,
            '/add-keyword': this.addKeyword,
            '/remove-keyword': this.removeKeyword,
            '/discard': this.discard,
            '/give-control': this.giveControl,
            '/reset-challenges-count': this.resetChallengeCount,
            '/cancel-prompt': this.cancelPrompt,
            '/token': this.setToken,
            '/reveal': this.reveal,
            '/duel': this.duel,
            '/move-to-conflict': this.moveToConflict,
            '/send-home': this.sendHome,            
            '/claim-favor': this.claimFavor,
            '/add-fate': this.addFate,
            '/rem-fate': this.remFate,
            '/add-fate-ring': this.addRingFate,
            '/rem-fate-ring': this.remRingFate,
            '/claim-ring' : this.claimRing,
            '/unclaim-ring': this.unclaimRing,
            '/chess-clocks': this.chessClocks,
            '/disconnectme': this.disconnectMe,
            '/manual': this.manual
        };
        this.tokens = [
            'fate'
        ];
    }

    executeCommand(player, command, args) {
        if(!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    chessClocks(player, args) {
        let num = this.getNumberOrDefault(args[1], 30);
        if(player.chessClockLeft > 0) {
            this.game.addMessage('{0} switches off chess clocks for both players', player);
            player.chessClockLeft = 0;
            if(player.opponent) {
                player.opponent.chessClockLeft = 0;
            }
        } else {
            this.game.addMessage('{0} switches on chess clocks for both players set at {1} minutes', player, num);
            player.chessClockLeft = 60 * num;
            if(player.opponent) {
                player.opponent.chessClockLeft = 60 * num;
            }
        }
    }

    draw(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

        player.drawCardsToHand(num);
    }
    
    claimFavor(player, args) {
        let type = args[1] || 'military';
        this.game.addMessage('{0} uses /claim-favor to claim the emperor\'s {1} favor', player, type);
        player.claimImperialFavor(type);
        let otherPlayer = this.game.getOtherPlayer(player);
        if(otherPlayer) {
            otherPlayer.loseImperialFavor();
        }
    }

    honor(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to honor',
            waitingPromptTitle: 'Waiting for opponent to honor',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                //honor card
                card.honor();

                this.game.addMessage('{0} uses the /honor command to honor {1}', p, card);
                return true;
            }
        });
    }

    dishonor(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to dishonor',
            waitingPromptTitle: 'Waiting for opponent to dishonor',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                //dishonor card
                card.dishonor();

                this.game.addMessage('{0} uses the /dishonor command to dishonor {1}', p, card);
                return true;
            }
        });
    }

    blank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to blank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.setBlank();

                this.game.addMessage('{0} uses the /blank command to blank {1}', p, card);
                return true;
            }
        });
    }

    unblank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to unblank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.clearBlank();

                this.game.addMessage('{0} uses the /unblank command to remove the blank condition from {1}', p, card);
                return true;
            }
        });
    }
    
    duel(player) {
        this.game.addMessage('{0} initiates a duel', player);
        this.game.queueStep(new HonorBidPrompt(this.game, 'Choose your bid for the duel'));
    }
    
    moveToConflict(player) {
        if(this.game.currentConflict) {
            this.game.promptForSelect(player, {
                activePromptTitle: 'Select cards to move into the conflict',
                waitingPromptTitle: 'Waiting for opponent to choose cards to move',
                cardCondition: card => card.location === 'play area' && card.controller === player && !card.inConflict,
                cardType: 'character',
                numCards: 0,
                multiSelect: true,
                onSelect: (p, cards) => {
                    if(p.isAttackingPlayer()) {
                        this.game.currentConflict.addAttackers(cards);
                    } else {
                        this.game.currentConflict.addDefenders(cards);
                    }
                    this.game.addMessage('{0} uses the /move-to-conflict command', p);
                    return true;
                }
            });
        } else {
            this.game.addMessage('/move-to-conflict can only be used during a conflict');
        }
    }

    sendHome(player) {
        if(this.game.currentConflict) {
            this.game.promptForSelect(player, {
                activePromptTitle: 'Select a card to send home',
                waitingPromptTitle: 'Waiting for opponent to send home',
                cardCondition: card => card.location === 'play area' && card.controller === player && card.inConflict,
                cardType: 'character',
                onSelect: (p, card) => {
                    //send home card
                    this.game.currentConflict.removeFromConflict(card);

                    this.game.addMessage('{0} uses the /send-home command to send {1} home', p, card);
                    return true;
                }
            });
        } else {
            this.game.addMessage('/move-to-conflict can only be used during a conflict');
        }
    }

    addTrait(player, args) {
        var trait = args[1];

        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add trait to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addTrait(trait);

                this.game.addMessage('{0} uses the /add-trait command to add the {1} trait to {2}', p, trait, card);
                return true;
            }
        });
    }

    removeTrait(player, args) {
        var trait = args[1];
        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to remove trait remove card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeTrait(trait);

                this.game.addMessage('{0} uses the /remove-trait command to remove the {1} trait from {2}', p, trait, card);
                return true;
            }
        });
    }

    addKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addKeyword(keyword);

                this.game.addMessage('{0} uses the /add-keyword command to add the {1} keyword to {2}', p, keyword, card);
                return true;
            }
        });
    }

    removeKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeKeyword(keyword);

                this.game.addMessage('{0} uses the /remove-keyword command to remove the {1} keyword from {2}', p, keyword, card);
                return true;
            }
        });
    }

    discard(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /discard command to discard {1} card{2} at random', player, num, num > 1 ? 's' : '');

        GameActions.discardAtRandom(num).resolve(player, this.game.getFrameworkContext());
    }

    strength(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set strength for',
            waitingPromptTitle: 'Waiting for opponent to set strength',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.strengthModifier = num - card.cardData.strength;
                this.game.addMessage('{0} uses the /strength command to set the strength of {1} to {2}', p, card, num);
                return true;
            }
        });
    }

    giveControl(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give control',
            cardCondition: card => ['play area', 'discard pile', 'dead pile'].includes(card.location) && card.controller === player,
            onSelect: (p, card) => {
                var otherPlayer = this.game.getOtherPlayer(player);
                if(!otherPlayer) {
                    return true;
                }

                this.game.takeControl(otherPlayer, card);
                this.game.addMessage('{0} uses the /give-control command to pass control of {1} to {2}', p, card, otherPlayer);

                return true;
            }
        });
    }

    resetChallengeCount(player) {
        player.challenges.reset();
        this.game.addMessage('{0} uses /reset-challenges-count to reset the number of challenges performed', player);
    }

    cancelPrompt(player) {
        this.game.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
        this.game.pipeline.cancelStep();
        this.game.cancelPromptUsed = true;
    }

    setToken(player, args) {
        var token = args[1];
        var num = this.getNumberOrDefault(args[2], 1);

        if(!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: card => (card.location === 'play area' || card.location === 'plot') && card.controller === player,
            onSelect: (p, card) => {
                var numTokens = card.tokens[token] || 0;

                card.addToken(token, num - numTokens);
                this.game.addMessage('{0} uses the /token command to set the {1} token count of {2} to {3}', p, token, card, num - numTokens);

                return true;
            }
        });
    }
    
    reveal(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            cardCondition: card => card.facedown && card.controller === player,
            onSelect: (player, card) => {
                card.facedown = false;
                this.game.addMessage('{0} reveals {1}', player, card);
                return true;
            }
        });
    }

    addFate(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set fate',
            cardCondition: card => (card.location === 'play area') && card.controller === player,
            onSelect: (p, card) => {

                card.modifyFate(num);
                this.game.addMessage('{0} uses the /add-fate command to set the fate count of {1} to {2}', p, card, card.getFate());

                return true;
            }
        });
    }

    remFate(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set fate',
            cardCondition: card => (card.location === 'play area') && card.controller === player,
            onSelect: (p, card) => {

                card.modifyFate(-num);
                this.game.addMessage('{0} uses the /rem-fate command to set the fate count of {1} to {2}', p, card, card.getFate());

                return true;
            }
        });
    }

    addRingFate(player, args) {
        let ringElement = (args[1]);
        let num = this.getNumberOrDefault(args[2], 1);

        if(_.contains(['air','earth','fire','void','water'], ringElement)) {
            let ring = this.game.rings[ringElement];

            ring.modifyFate(num);
            this.game.addMessage('{0} uses the /add-fate-ring command to set the fate count of the ring of {1} to {2}', player, ringElement, ring.getFate());
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (player, ring) => {
                    ring.modifyFate(num);
                    this.game.addMessage('{0} uses the /add-fate-ring command to set the fate count of the ring of {1} to {2}', player, ring.element, ring.getFate());
                    return true;
                }
            });
        }

        return true;
    }

    remRingFate(player, args) {
        let ringElement = (args[1]);
        let num = this.getNumberOrDefault(args[2], 1);

        if(_.contains(['air','earth','fire','void','water'], ringElement)) {
            let ring = this.game.rings[ringElement];

            ring.modifyFate(-num);
            this.game.addMessage('{0} uses the /rem-fate-ring command to set the fate count of the ring of {1} to {2}', player, ringElement, ring.getFate());
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (player, ring) => {
                    ring.modifyFate(-num);
                    this.game.addMessage('{0} uses the /rem-fate-ring command to set the fate count of the ring of {1} to {2}', player, ring.element, ring.getFate());
                    return true;
                }
            });
        }

        return true;
    }

    claimRing(player, args) {
        let ringElement = (args[1]);

        if(_.contains(['air','earth','fire','void','water'], ringElement)) {
            let ring = this.game.rings[ringElement];

            ring.claimRing(player);
            this.game.addMessage('{0} uses the /claim-ring command to claim the ring of {1}', player, ringElement);
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (player, ring) => {
                    ring.claimRing(player);
                    this.game.addMessage('{0} uses the /claim-ring command to claim the ring of {1}', player, ring.element);
                    return true;
                }
            });
        }

        return true;
    }

    unclaimRing(player, args) {
        let ringElement = (args[1]);

        if(_.contains(['air','earth','fire','void','water'], ringElement)) {
            let ring = this.game.rings[ringElement];

            ring.resetRing();
            this.game.addMessage('{0} uses the /unclaim-ring command to set the ring of {1} as unclaimed', player, ringElement);
        } else {
            this.game.promptForRingSelect(player, {
                ringCondition: ring => ring.claimed,
                onSelect: (player, ring) => {
                    ring.resetRing();
                    this.game.addMessage('{0} uses the /unclaim-ring command to set the ring of {1} as unclaimed', player, ring.element);
                    return true;
                }
            });
        }

        return true;
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }
    
    manual(player) {
        if(this.game.manualMode) {
            this.game.manualMode = false;
            this.game.addMessage('{0} switches manual mode off', player);
        } else {
            this.game.manualMode = true;
            this.game.addMessage('{0} switches manual mode on', player);
        }
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidIcon(icon) {
        if(!icon) {
            return false;
        }

        var lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    isValidToken(token) {
        if(!token) {
            return false;
        }

        var lowerToken = token.toLowerCase();

        return _.contains(this.tokens, lowerToken);
    }
}

module.exports = ChatCommands;
