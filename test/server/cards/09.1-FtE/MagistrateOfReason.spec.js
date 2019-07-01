describe('Magistrate of Reason', function() {
    integration(function() {
        describe('Magistrate of Reason\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['magistrate-of-reason', 'miya-mystic']
                    },
                    player2: {
                        inPlay: ['vanguard-warrior', 'kaiu-envoy'],
                        dynastyDiscard: ['favorable-ground']
                    }
                });

                this.magistrateOfReason = this.player1.findCardByName('magistrate-of-reason');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.vanguardWarrior = this.player2.findCardByName('vanguard-warrior');
                this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');

                this.player1.claimRing('water');
            });

            it('should have no effect if Magistrate of Reason is not attacking', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.clickCard(this.vanguardWarrior);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should have no effect when Magistrate of Reason is defending', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kaiuEnvoy],
                    defenders: []
                });
                this.player1.pass();
                this.player2.clickCard(this.vanguardWarrior);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt opponent to choose an unclaimed ring to pay fate to', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.magistrateOfReason],
                    defenders: [],
                    ring: 'air'
                });
                this.player2.clickCard(this.vanguardWarrior);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.player2).toHavePrompt('Select a ring to place fate on');
                expect(this.player2).not.toBeAbleToSelectRing('air');
                expect(this.player2).toBeAbleToSelectRing('fire');
                expect(this.player2).toBeAbleToSelectRing('earth');
                expect(this.player2).toBeAbleToSelectRing('void');
                expect(this.player2).not.toBeAbleToSelectRing('water');
            });

            it('should have no effect on non-character abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.magistrateOfReason],
                    defenders: []
                });
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prevent character abilities if there are no rings unclaimed', function() {
                this.player1.claimRing('fire');
                this.player2.claimRing('earth');
                this.player2.claimRing('void');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.magistrateOfReason],
                    defenders: [],
                    ring: 'air'
                });
                this.player2.clickCard(this.vanguardWarrior);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

