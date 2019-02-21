describe('Try Again Tomorrow', function() {
    integration(function() {
        describe('Try Again Tomorrow\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law', 'doji-challenger'],
                        hand: ['try-again-tomorrow']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

                this.tryAgainTomorrow = this.player1.findCardByName('try-again-tomorrow');
            });

            it('should not trigger outside a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.tryAgainTomorrow);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger in a conflict without a controlled courtier', function() {
                this.dojiChallenger.honor();
                this.dojiWhisperer.honor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.tryAgainTomorrow);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger in a conflict without an honored controlled courtier', function() {
                this.dojiWhisperer.honor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.stewardOfLaw],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.tryAgainTomorrow);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict as the attacker', function() {
                beforeEach(function() {
                    this.stewardOfLaw.honor();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.stewardOfLaw, this.dojiChallenger],
                        defenders: [this.dojiWhisperer]
                    });
                });

                it('should allow you to target an attacking character', function() {
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.tryAgainTomorrow);
                    expect(this.player1).toBeAbleToSelect(this.stewardOfLaw);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.clickCard(this.tryAgainTomorrow);
                        this.player1.clickCard(this.dojiChallenger);
                    });

                    it('should send the chosen character home', function() {
                        expect(this.stewardOfLaw.inConflict).toBe(true);
                        expect(this.dojiChallenger.inConflict).toBe(false);
                        expect(this.dojiWhisperer.inConflict).toBe(true);
                    });
                });
            });

            describe('during a conflict as the defender', function() {
                beforeEach(function() {
                    this.stewardOfLaw.honor();
                    this.noMoreActions();
                    this.player1.clickPrompt('Pass Conflict');
                    this.player1.clickPrompt('yes');
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.dojiWhisperer],
                        defenders: [this.stewardOfLaw]
                    });
                });

                it('should allow you to target an attacking character', function() {
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.tryAgainTomorrow);
                    expect(this.player1).not.toBeAbleToSelect(this.stewardOfLaw);
                    expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.tryAgainTomorrow);
                        this.player1.clickCard(this.dojiWhisperer);
                    });

                    it('should send the chosen character home', function() {
                        expect(this.stewardOfLaw.inConflict).toBe(true);
                        expect(this.dojiWhisperer.inConflict).toBe(false);
                    });
                });
            });
        });
    });
});
