describe('Akodo Toturi', function () {
    integration(function () {
        describe('Akodo Toturi\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi']
                    },
                    player2: {
                        inPlay: ['togashi-initiate', 'isawa-kaede']
                    }
                });
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
                this.isawaKaede = this.player2.findCardByName('isawa-kaede');
                this.noMoreActions();
            });

            it('should trigger when claiming a military ring as the attacker', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToturi],
                    defenders: [],
                    ring: 'air'
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
            });

            it('should not trigger when claiming a political ring as the attacker', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoToturi],
                    defenders: [],
                    ring: 'air'
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            // Decemeber 2019 v12 RRG Update: Resolving the ring is now always as the attacker.
            it('Toturi\'s controller should get to choose 1 element to resolve when winning on defense vs Isawa Kaede', function () {
                this.togashiInitiate.fate = 1;
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.isawaKaede],
                    defenders: [this.akodoToturi],
                    ring: 'fire'
                });
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Choose a ring effect to resolve (click the ring you want to resolve)');
                this.player1.clickRing('void');
                expect(this.player1).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player1).not.toBeAbleToSelect(this.akodoToturi);
                this.player1.clickCard(this.togashiInitiate);
                expect(this.togashiInitiate.fate).toBe(0);
            });
        });
    });
});
