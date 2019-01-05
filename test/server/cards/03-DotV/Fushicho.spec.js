describe('Fushicho', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['fushicho'],
                    hand: ['fine-katana'],
                    dynastyDiscard: ['adept-of-the-waves', 'miya-mystic']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu']
                }
            });

            this.fushicho = this.player1.findCardByName('fushicho');
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
            this.miyaMystic = this.player1.findCardByName('miya-mystic');

            this.fineKatana = this.player1.findCardByName('fine-katana');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
        });

        describe('Fushicho\'s constant abililty', function() {
            it('should not allow attachments', function() {
                this.player1.clickCard(this.fineKatana);
                expect(this.player1).not.toBeAbleToSelect(this.fushicho);
            });
        });

        describe('Fushicho\'s triggered ability', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.fushicho],
                    defenders: [this.mirumotoRaitsugu]
                });

                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.fushicho);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
            });

            it('should trigger when it leaves play', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.fushicho);
            });

            it('should allow you to select a phoenix character in the discard pile', function() {
                this.player1.clickCard(this.fushicho);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should bring that character into play with 1 fate', function() {
                this.player1.clickCard(this.fushicho);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.location).toBe('play area');
                expect(this.adeptOfTheWaves.inConflict).toBe(false);
                expect(this.adeptOfTheWaves.fate).toBe(1);
            });
        });
    });
});
