describe('Cloak of Night', function() {
    integration(function() {
        describe('Cloak of Night\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'doji-whisperer'],
                        hand: ['cloak-of-night', 'a-fate-worse-than-death']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'isawa-ujina'],
                        hand: ['a-fate-worse-than-death', 'kirei-ko']
                    }
                });
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.cloak = this.player1.findCardByName('cloak-of-night');
                this.p1afwtd = this.player1.findCardByName('a-fate-worse-than-death');

                this.p2afwtd = this.player2.findCardByName('a-fate-worse-than-death');
                this.p2kireiko = this.player2.findCardByName('kirei-ko');
                this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.ujina = this.player2.findCardByName('isawa-ujina');
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.whisperer],
                    defenders: [this.raitsugu],
                    ring: 'void'
                });
                this.glory = this.adept.glory;
                this.player2.pass();
                this.player1.clickCard(this.cloak);
                this.player1.clickCard(this.adept);
            });

            it('should give the chosen character +3 glory', function() {
                expect(this.adept.glory).toBe(this.glory + 3);
            });

            it('should prevent targeting by opponent abilities (event)', function() {
                this.player2.clickCard(this.p2afwtd);
                expect(this.player2).toBeAbleToSelect(this.raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.adept);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
            });

            it('should prevent targeting by opponent abilities (printed)', function() {
                this.player2.clickCard(this.raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.adept);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
            });

            it('should allow targeting by own abilities (event)', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1afwtd);
                expect(this.player1).toBeAbleToSelect(this.raitsugu);
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
            });

            it('should allow targeting by own abilities (printed)', function() {
                this.player2.pass();
                this.player1.clickCard(this.adept);
                expect(this.player1).toBeAbleToSelect(this.raitsugu);
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
            });

            it('should allow non-targeting abilities', function() {
                this.player2.pass();
                this.player1.clickCard(this.adept);
                expect(this.adept.bowed).toBe(false);
                this.player1.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2kireiko);
                this.player2.clickCard(this.p2kireiko);
                expect(this.adept.bowed).toBe(true);
            });

            it('should not allow targeting by forced reactions (Ujina)', function() {
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Isawa Ujina');
                expect(this.player2).toBeAbleToSelect(this.raitsugu);
                expect(this.player2).toBeAbleToSelect(this.ujina);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).not.toBeAbleToSelect(this.adept);
            });
        });
    });
});
