describe('(2) Draw Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    hand: ['fine-katana']
                },
                player2: {
                    hand: ['fine-katana']
                }
            });

            this.chat = spyOn(this.game, 'addMessage');

            this.raiseEventSpy = spyOn(this.game, 'raiseEvent').and.callThrough();

            this.flow.nextPhase();
        });

        describe('Prior to (2.1) \'Draw Phase begins\' step', function() {
            it('should raise an onPhaseCreated event', function() {
                expect(this.game.currentPhase).toBe('draw');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseCreated', { phase: 'draw' }, jasmine.any(Function));
            });
        });

        describe('(2.1) \'Draw Phase begins\' step', function() {
            it('should raise an onPhaseStarted event', function() {
                expect(this.game.currentPhase).toBe('draw');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseStarted', { phase: 'draw' }, jasmine.any(Function));
            });
        });

        describe('(2.2) \'Honor bid\' step', function() {
            it('should prompt both players to choose a bid', function() {
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('4');
                expect(this.player1).toHavePromptButton('5');
                expect(this.player2).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePromptButton('1');
                expect(this.player2).toHavePromptButton('2');
                expect(this.player2).toHavePromptButton('3');
                expect(this.player2).toHavePromptButton('4');
                expect(this.player2).toHavePromptButton('5');
            });

            it('should wait for both players to choose a bid, (player 1 chooses first)', function() {
                this.player1.clickPrompt('1');
                expect(this.chat).not.toHaveBeenCalledWith('{0} reveals a bid of {1}', this.player1.player, 1);
                expect(this.player2).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePromptButton('1');
                expect(this.player2).toHavePromptButton('2');
                expect(this.player2).toHavePromptButton('3');
                expect(this.player2).toHavePromptButton('4');
                expect(this.player2).toHavePromptButton('5');
                expect(this.player1).toHavePrompt('Waiting for opponent to choose a bid.');
            });

            it('should wait for both players to choose a bid, (player 2 chooses first)', function() {
                this.player2.clickPrompt('1');
                expect(this.chat).not.toHaveBeenCalledWith('{0} reveals a bid of {1}', this.player2.player, 1);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('4');
                expect(this.player1).toHavePromptButton('5');
                expect(this.player2).toHavePrompt('Waiting for opponent to choose a bid.');
            });
        });

        describe('(2.3) \'Reveal honor dials\' step', function() {
            beforeEach(function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('3');
            });

            it('should declare each bid in the chat', function() {
                expect(this.chat).toHaveBeenCalledWith('{0} reveals a bid of {1}', this.player1.player, 2);
                expect(this.chat).toHaveBeenCalledWith('{0} reveals a bid of {1}', this.player2.player, 3);
            });

            it('should set honor dials to new values', function() {
                expect(this.player1.player.honorBid).toBe(2);
                expect(this.player2.player.honorBid).toBe(3);
            });
        });

        describe('(2.4) \'Transfer honor\' step', function() {
            it('should transfer honor when player 1 bids higher', function() {
                let player1honor = this.player1.player.honor;
                let player2honor = this.player2.player.honor;
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('3');
                expect(this.player1.player.honor).toBe(player1honor - 5 + 3);
                expect(this.player2.player.honor).toBe(player2honor - 3 + 5);
            });

            it('should transfer honor when player 2 bids higher', function() {
                let player1honor = this.player1.player.honor;
                let player2honor = this.player2.player.honor;
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('4');
                expect(this.player1.player.honor).toBe(player1honor - 2 + 4);
                expect(this.player2.player.honor).toBe(player2honor - 4 + 2);
            });

            it('should not transfer any honor when bids are equal', function() {
                let player1honor = this.player1.player.honor;
                let player2honor = this.player2.player.honor;
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                expect(this.player1.player.honor).toBe(player1honor);
                expect(this.player2.player.honor).toBe(player2honor);
            });
        });

        describe('(2.5) \'Draw cards\' step', function() {
            it('should draw cards for both players equal to thier bids', function() {
                let player1handSize = this.player1.hand.length;
                let player1conflictDeckSize = this.player1.conflictDeck.length;
                let player2handSize = this.player2.hand.length;
                let player2conflictDeckSize = this.player2.conflictDeck.length;
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('4');
                expect(this.player1.hand.length).toBe(player1handSize + 3);
                expect(this.player1.conflictDeck.length).toBe(player1conflictDeckSize - 3);
                expect(this.player2.hand.length).toBe(player2handSize + 4);
                expect(this.player2.conflictDeck.length).toBe(player2conflictDeckSize - 4);
            });
        });

        describe('(post 2.5) "Action Window" step', () => {
            it(', if player.promptedActionWindows.draw = true, should prompt the first player to play an action or pass', function() {
                this.player1.player.promptedActionWindows.draw = true;
                this.player2.player.promptedActionWindows.draw = true;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).toHavePrompt('Initiate an action');
                expect(this.player1).toHavePromptButton('Pass');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it(', if player.promptedActionWindows.draw = false, should not prompt the first player to play an action or pass', function() {
                this.player1.player.promptedActionWindows.draw = false;
                this.player2.player.promptedActionWindows.draw = true;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).not.toHavePrompt('Initiate an action');
                expect(this.player2).not.toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it(', if player.promptedActionWindows.draw = true, should prompt the second player to play an action or pass after the first', function() {
                this.player1.player.promptedActionWindows.draw = true;
                this.player2.player.promptedActionWindows.draw = true;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickPrompt('Pass');
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player2).toHavePrompt('Initiate an action');
                expect(this.player2).toHavePromptButton('Pass');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });

        describe('(2.6) "Draw phase ends" step', () => {
            beforeEach(function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should raise an onPhaseEnded event', function() {
                expect(this.game.currentPhase).toBe('conflict');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseEnded', { phase: 'draw' });
            });
        });
    });
});
