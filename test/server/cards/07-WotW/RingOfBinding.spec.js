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
                    hand: ['ring-of-binding']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.banzai = this.player2.findCardByName('banzai');
            this.player1.playAttachment('ring-of-binding', this.borderRider);
            this.player2.playAttachment('ring-of-binding', this.mirumotoRaitsugu);
            this.noMoreActions();
        });

        it('should stop the fate from being removed from border rider during the fate phase', function () {
            this.borderRider.fate = 1;
            this.nextPhase();
            this.player1.pass();
            expect(this.borderRider.fate).toBe(1);
        });

        it('should stop border rider from being discarded in the fate phase', function () {
            this.nextPhase();
            this.player1.pass();
            expect(this.borderRider.location).toBe('play area');
        });

        it('should not stop raitsugu from removing a fate', function () {
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.mirumotoRaitsugu]
            });
            this.borderRider.fate = 1;
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.borderRider);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.borderRider.fate).toBe(1);
        });

        it('should not stop raitsugu from removing a fate', function () {
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.mirumotoRaitsugu]
            });
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.borderRider);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.borderRider.location).toBe('dynasty discard pile');
        });

        it('should not stop the fate from being removed from raitsugu during the fate phase', function () {
            this.mirumotoRaitsugu.fate = 1;
            this.nextPhase();
            this.player1.pass();
            expect(this.mirumotoRaitsugu.fate).toBe(0);
        });

        it('should not stop raitsugu from being discarded in the fate phase', function () {
            this.nextPhase();
            this.player1.pass();
            expect(this.mirumotoRaitsugu.location).toBe('dynasty discard pile');
        });

    });
});
