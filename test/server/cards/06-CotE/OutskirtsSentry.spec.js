describe('Outskirts Sentry', function() {
    integration(function() {
        describe('Outskirts Sentry ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['outskirts-sentry','shinjo-outrider','shinjo-scout'],
                        hand: ['favored-mount'],
                        dynastyDeck: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider','matsu-berserker']
                    }
                });
                this.fg = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.sentry = this.player1.findCardByName('outskirts-sentry');
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.mount = this.player1.playAttachment('favored-mount', this.sentry);

                this.berserker = this.player2.findCardByName('matsu-berserker');

                this.noMoreActions();
            });

            it('should trigger when another character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.sentry],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sentry);
            });

            it('should trigger when an opposing character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.sentry],
                    defenders: []
                });
                this.player2.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sentry);
            });

            it('should trigger when it joins a conflict itself', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mount);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sentry);
            });

            it('should only target participating characters', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mount);
                this.player1.clickCard(this.sentry);
                expect(this.player1).toBeAbleToSelect(this.sentry);
                expect(this.player1).toBeAbleToSelect(this.outrider);
                expect(this.player1).not.toBeAbleToSelect('shinjo-scout');
                expect(this.player1).not.toBeAbleToSelect(this.berserker);
            });

            it('should honor the target', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mount);
                this.player1.clickCard(this.sentry);
                this.player1.clickCard(this.sentry);
                expect(this.sentry.isHonored).toBe(true);
            });
        });
    });
});
