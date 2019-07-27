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
                        inPlay: ['bayushi-aramoro', 'shrine-maiden'],
                        hand: ['fiery-madness', 'i-can-swim']
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
                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;
                this.kaede.dishonor();
                this.player2.clickCard('i-can-swim');
                this.player2.clickCard(this.kaede);
                expect(this.player1).not.toBeAbleToSelect(this.kaede);
                expect(this.kaede.location).toBe('dynasty discard pile');
            });

            it('should make her immune to ring effects', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: ['shrine-maiden'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Fire Ring');
                expect(this.player2).not.toBeAbleToSelect(this.kaede);
            });
        });
    });
});

