describe('Clarity of Purpose', function() {
    integration(function() {
        describe('Clarity of Purpose\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves','asako-diplomat'],
                        hand: ['clarity-of-purpose']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['for-shame', 'kirei-ko']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');

                this.clarityOfPurpose = this.player1.findCardByName('clarity-of-purpose');

                this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');

                this.forShame = this.player2.findCardByName('for-shame');
                this.kireiKo = this.player2.findCardByName('kirei-ko');
            });

            it('should not be triggerable outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.clarityOfPurpose);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a political conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.adeptOfTheWaves],
                        defenders: [this.bayushiManipulator],
                        type: 'political'
                    });
                });

                it('should allow you to choose a character you control', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.clarityOfPurpose);
                    expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                    expect(this.player1).toBeAbleToSelect(this.asakoDiplomat);
                    expect(this.player1).not.toBeAbleToSelect(this.bayushiManipulator);
                });

                describe('if resolved', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.clickCard(this.clarityOfPurpose);
                        this.player1.clickCard(this.adeptOfTheWaves);
                    });

                    it('should prevent opponents\' card effects from bowing', function() {
                        this.adeptOfTheWaves.dishonor();
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.forShame);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        expect(this.adeptOfTheWaves.bowed).toBe(false);
                    });

                    it('should prevent bowing as a result of conflict resolution', function() {
                        this.noMoreActions();
                        this.player1.clickPrompt('Don\'t Resolve');
                        expect(this.adeptOfTheWaves.bowed).toBe(false);
                    });

                    it('should allow bowing after the conflict ends', function() {
                        this.noMoreActions();
                        this.player1.clickPrompt('Don\'t Resolve');
                        expect(this.adeptOfTheWaves.bowed).toBe(false);
                        this.player1.clickCard(this.adeptOfTheWaves);
                        this.player1.clickCard(this.adeptOfTheWaves);
                        this.player2.clickCard(this.kireiKo);
                        expect(this.adeptOfTheWaves.bowed).toBe(true);
                    });
                });
            });

            it('should still allow bowing as a result of a military conflict resolution', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: [this.bayushiManipulator],
                    type: 'military'
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
            });

        });
    });
});
