describe('Ring of Binding', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider'],
                    hand: ['ring-of-binding']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['banzai']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.banzai = this.player2.findCardByName('banzai');
            this.player1.playAttachment('ring-of-binding', this.borderRider);
            this.noMoreActions();
        });

        it('should stop the fate from being removed during the fate phase', function () {
            this.borderRider.fate = 1;
            this.nextPhase();
            expect(this.borderRider.fate).toBe(1);
        });

        it('should stop the character from being discarded in the fate phase', function () {
            this.nextPhase();
            expect(this.borderRider.location).toBe('play area');
        });
    });
});
