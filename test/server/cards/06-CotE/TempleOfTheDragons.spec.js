describe('Temple of the Dragons', function() {
    integration(function() {
        describe('Temple of the Dragons\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['temple-of-the-dragons']
                    }
                });
                this.zerker = this.player1.findCardByName('matsu-berserker');

                this.totd = this.player2.findCardByName('temple-of-the-dragons');
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        ring: 'fire',
                        attackers: [this.zerker]
                    });
                    it('should trigger after being revealed', function () {
                        expect(this.player2).toHavePrompt('Triggered Abilities');
                        expect(this.player2).toBeAbleToSelect(this.totd);
                    });

                    it('should allow the defender to trigger the ring', function () {
                        expect(this.player2).toBeAbleToSelect(this.totd);
                        this.player2.clickCard(this.totd);
                        expect(this.player2).toHavePrompt('Fire Ring');
                    });

                    it('should allow the defender to trigger the ring', function () {
                        this.player2.clickCard(this.totd);
                        this.player2.clickCard(this.zerker);
                        this.player2.clickPrompt('Dishonor Matsu Berserker');
                        expect(this.zerker.isDishonored).toBe(true);
                    });
                });

                this.noMoreActions();
                this.initiateConflict({
                    ring: 'void',
                    attackers: [this.zerker]
                });

                it('should not trigger if no unit are eligible for the ring effect', function () {
                    expect(this.player2).not.toHavePrompt('Triggered Abilities');
                    expect(this.player2).not.toBeAbleToSelect(this.totd);
                    expect(this.player2).toHavePrompt('Select Defenders');
                });
            });
        });

    });
});
