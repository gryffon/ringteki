describe('Favor of the Kami', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['favor-of-the-kami']
                }
            });
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
            this.favorOfTheKami = this.player1.findCardByName('favor-of-the-kami');
        });

        it('should give the attached character +1 glory', function() {
            let glory = this.adeptOfTheWaves.glory;
            this.player1.playAttachment(this.favorOfTheKami, this.adeptOfTheWaves);
            expect(this.adeptOfTheWaves.glory).toBe(glory + 1);
        });
    });
});
