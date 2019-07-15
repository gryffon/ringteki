describe('Akodo Kaede', function() {
    integration(function() {
        describe('Akodo Kaede\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'borderlands-defender', 'akodo-kaede'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro'],
                        hand: ['fiery-madness', 'noble-sacrifice']
                    }
                });
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.assassination = this.player1.findCardByName('assassination');
                this.kaede = this.player1.findCardByName('akodo-kaede');
                this.kaede.fate = 1;
                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.borderlandsDefender, this.kaede],
                    defenders: [this.bayushiAramoro]
                });
            });

            it('should be able to be used when a character you control is leaving play', function () {
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.hidaGuardian);
                expect(this.player1).toBeAbleToSelect(this.kaede);
            });

            it('should stop the character from leaving play', function() {
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.kaede);
                expect(this.hidaGuardian.location).toBe('play area');
            });

            it('should not stop a character from dying from a lasting effect', function() {
                this.player2.clickCard(this.bayushiAramoro);
                this.player2.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.kaede);
                expect(this.hidaGuardian.location).toBe('dynasty discard pile');
                expect(this.kaede.fate).toBe(0);
            });

            it('should not let kaede save herself', function() {
                this.bayushiAramoro.honor();
                this.kaede.dishonor();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickPrompt('Pay Costs First');
                this.player2.clickCard(this.bayushiAramoro);
                this.player2.clickCard(this.kaede);
                expect(this.player1).not.toBeAbleToSelect(this.kaede);
                expect(this.kaede.location).toBe('dynasty discard pile');
            });
        });
    });
});

