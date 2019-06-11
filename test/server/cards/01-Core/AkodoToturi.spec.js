describe('Akodo Gunso', function () {
    integration(function () {
        describe('Akodo Toturi\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi']
                    },
                    player2: {
                        inPlay: ['togashi-initiate']
                    }
                });
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
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

            it('should force the opponent to resolve the ring effect when claimed as the defender', function () {
                this.togashiInitiate.fate = 1;
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiInitiate],
                    defenders: [this.akodoToturi],
                    ring: 'void'
                });
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player2).toHavePrompt('Void Ring');
                expect(this.player2).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player2).not.toBeAbleToSelect(this.akodoToturi);
                this.player2.clickCard(this.togashiInitiate);
                expect(this.togashiInitiate.fate).toBe(0);
            });
        });
    });
});
