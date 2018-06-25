describe('Soul Beyond Reproach', function() {
    integration(function() {
        describe('Soul Beyond Reproach\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'kakita-yoshi', 'kakita-kaezin'],
                        hand: ['soul-beyond-reproach']
                    },
                    player2: {
                        inPlay: ['steadfast-witch-hunter']
                    }
                });
                this.soulBeyondReproach = this.player1.findCardByName('soul-beyond-reproach');
                this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.hotaru.dishonor();
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.kaezin = this.player1.findCardByName('kakita-kaezin');
                this.kaezin.honor();
                this.witchHunter = this.player2.findCardByName('steadfast-witch-hunter');
            });

            describe('When selecting a target character', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                });
                it('should not be allowed to target opponents characters', function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).not.toBeAbleToSelect(this.witchHunter);
                });
                it('should not be allowed to target honored characters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).not.toBeAbleToSelect(this.kaezin);
                });
                it('should be allowed to target ordinary charcters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).toBeAbleToSelect(this.yoshi);
                });
                it('should be allowed to target dishonored charcters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).toBeAbleToSelect(this.hotaru);
                });
            });

            describe('When played on a character in ordinary state, it', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    this.player1.clickCard(this.yoshi);
                });

                it('should result in the target being in honored state', function() {
                    expect(this.yoshi.isHonored).toBe(true);
                });
            });

            describe('When played on a character in dishonored state, it', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    this.player1.clickCard(this.hotaru);
                });

                it('should result in the target being in honored state', function() {
                    expect(this.hotaru.isHonored).toBe(true);
                });
            });
        });
    });
});
