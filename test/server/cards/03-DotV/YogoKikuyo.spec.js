describe('Yogo Kikuyo', function() {
    integration(function() {
        describe('Yogo Kikuyo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['soshi-illusionist'],
                        hand: ['yogo-kikuyo']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['against-the-waves']
                    }
                });
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.yogoKikuyo = this.player1.findCardByName('yogo-kikuyo');

                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
            });

            it('should not trigger outside of a conflict', function() {
                this.player1.pass();
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.scholar.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger when a spell is played during a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yogoKikuyo);
            });

            it('should put this character into play (at home)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                this.player1.clickCard(this.yogoKikuyo);
                expect(this.yogoKikuyo.location).toBe('play area');
                expect(this.yogoKikuyo.inConflict).toBe(false);
            });

            it('should cancel the effects of the spell', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                this.player1.clickCard(this.yogoKikuyo);
                expect(this.scholar.bowed).toBe(false);
            });
        });
    });
});
