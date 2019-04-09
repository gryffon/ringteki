describe('Censure', function() {
    integration(function() {
        describe('Censure\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['fawning-diplomat'],
                        hand: ['censure', 'court-mask']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['way-of-the-crane', 'soul-beyond-reproach', 'noble-sacrifice']
                    }
                });
                this.fawningDiplomat = this.player1.findCardByName('fawning-diplomat');
                this.censure = this.player1.findCardByName('censure');
                this.courtMask = this.player1.findCardByName('court-mask');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiCallenger = this.player2.findCardByName('doji-challenger');
                this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
                this.soulBeyondReproach = this.player2.findCardByName('soul-beyond-reproach');
                this.nobleSacrifice = this.player2.findCardByName('noble-sacrifice');
            });

            it('should not be triggered if player does not have the imperial favor', function() {
                this.player1.pass();
                this.player2.clickCard(this.wayOfTheCrane);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.isHonored).toBe(true);
            });

            it('should be triggered if player has the imperial favor', function() {
                this.player1.clickCard(this.courtMask);
                this.player1.clickCard(this.fawningDiplomat);
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.courtMask);
                this.player2.clickCard(this.nobleSacrifice);
                this.player2.clickCard(this.fawningDiplomat);
                this.player2.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.fawningDiplomat);
                this.player1.clickPrompt('Military');
                expect(this.player1.player.imperialFavor).toBe('military');
                this.player1.pass();
                this.player2.clickCard(this.soulBeyondReproach);
                this.player2.clickCard(this.dojiCallenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.censure);
            });

            it('should cancel the effects of the event', function() {
                this.player1.clickCard(this.courtMask);
                this.player1.clickCard(this.fawningDiplomat);
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.courtMask);
                this.player2.clickCard(this.nobleSacrifice);
                this.player2.clickCard(this.fawningDiplomat);
                this.player2.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.fawningDiplomat);
                this.player1.clickPrompt('Military');
                expect(this.player1.player.imperialFavor).toBe('military');
                this.player1.pass();
                this.player2.clickCard(this.soulBeyondReproach);
                this.player2.clickCard(this.dojiCallenger);
                this.player1.clickCard(this.censure);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.dojiCallenger.isHonored).toBe(false);
                expect(this.wayOfTheCrane.location).toBe('conflict discard pile');
                expect(this.getChatLogs(1)).toContain('player1 plays Censure to cancel the effects of Soul Beyond Reproach');
            });
        });
    });
});
