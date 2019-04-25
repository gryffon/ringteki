describe('Armament Artisan', function() {
    integration(function() {
        describe('Armament Artisan\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['armament-artisan', 'doji-whisperer','savvy-politician'],
                        hand: ['way-of-the-crane']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['way-of-the-crane']
                    }
                });

                this.armamentArtisan = this.player1.findCardByName('armament-artisan');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.savvyPolitician = this.player1.findCardByName('savvy-politician');
                this.wotCrane = this.player1.findCardByName('way-of-the-crane');

                this.challenger = this.player2.findCardByName('doji-challenger');

            });

            it('should not trigger when a character controlled by the opponent is honored', function() {
                this.player1.pass();
                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.challenger);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should trigger when a character controlled by the player is honored', function() {
                this.player1.clickCard(this.wotCrane);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.armamentArtisan);
            });

            it('should honor the character', function() {
                this.player1.clickCard(this.wotCrane);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.armamentArtisan);
                expect(this.armamentArtisan.isHonored).toBe(true);
            });

            it('should not trigger after he is honored himself', function() {
                this.player1.clickCard(this.wotCrane);
                this.player1.clickCard(this.savvyPolitician);
                expect(this.savvyPolitician.isHonored).toBe(true);
                this.player1.clickCard(this.savvyPolitician);
                this.player1.clickCard(this.armamentArtisan);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.armamentArtisan.isHonored).toBe(true);
            });
        });
    });
});
