describe('Kitsuki Yuikimi', function() {
    integration(function() {
        describe('Kitsuki Yuikimi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yuikimi', 'kitsuki-investigator']
                    },
                    player2: {
                        hand: ['banzai']
                    }
                });

                this.kitsukuYuikimi = this.player1.findCardByName('kitsuki-yuikimi');
                this.kitsukiInvestigator = this.player1.findCardByName('kitsuki-investigator');
                this.banzai = this.player2.findCardByName('banzai');

                this.game.rings.air.fate = 1;
            });

            it('should trigger when you gain fate during a conflict in which Kitsuki Yuikimi is participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kitsukuYuikimi],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukuYuikimi);
            });

            it('should not trigger if Kitsuki Yuikimi is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kitsukiInvestigator],
                    ring: 'air'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should not trigger if you do not gain fate', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kitsukuYuikimi],
                    ring: 'fire'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should prevent Kitsuki Yuikimi from being targeted by opponent\'s triggered abilities', function() {
                let fate = this.player1.player.fate;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kitsukuYuikimi, this.kitsukiInvestigator],
                    ring: 'air'
                });
                this.player1.clickCard(this.kitsukuYuikimi);
                expect(this.getChatLogs(3)).toContain('player1 uses Kitsuki Yuikimi to prevent Kitsuki Yuikimi from being chosen as the target of player2\'s triggered abilities until the end of the conflict');
                expect(this.player1.player.fate).toBe(fate + 1);
                expect(this.game.rings.air.fate).toBe(0);
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.banzai);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.kitsukuYuikimi);
                expect(this.player2).toBeAbleToSelect(this.kitsukiInvestigator);
            });
        });
    });
});

