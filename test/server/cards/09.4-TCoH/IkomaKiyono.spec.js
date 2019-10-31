describe('Ikoma Kiyono', function() {
    integration(function() {
        describe('Ikoma Kiyono\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-kiyono'],
                        hand: ['severed-from-the-stream'],
                        honor: 12
                    },
                    player2: {
                        inPlay: ['asahina-artisan'],
                        honor: 10
                    }
                });
                this.ikomaKiyono = this.player1.findCardByName('ikoma-kiyono');
                this.severedFromTheStream = this.player1.findCardByName('severed-from-the-stream');
                this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');
            });

            it('should allow to react to glory counts that are not the count for the imperial favor', function () {
                this.ikomaKiyono.bow();
                expect(this.ikomaKiyono.bowed).toBe(true);

                this.player1.clickCard(this.severedFromTheStream);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ikomaKiyono);

                this.player1.clickCard(this.ikomaKiyono);
                expect(this.ikomaKiyono.bowed).toBe(false);
            });

            it('should allow to react to the count of the imperial favor', function () {
                this.ikomaKiyono.bow();
                expect(this.ikomaKiyono.bowed).toBe(true);

                this.flow.finishConflictPhase();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ikomaKiyono);

                this.player1.clickCard(this.ikomaKiyono);
                expect(this.ikomaKiyono.bowed).toBe(false);

                expect(this.player1.imperialFavor).not.toBe('');
            });

            it('should not allow to trigger Kiyono if you are less honorable', function () {
                this.ikomaKiyono.bow();
                expect(this.ikomaKiyono.bowed).toBe(true);

                this.player1.honor = 10;
                this.player2.honor = 11;

                this.flow.finishConflictPhase();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not allow to trigger Kiyono if you are equally honorable', function () {
                this.ikomaKiyono.bow();
                expect(this.ikomaKiyono.bowed).toBe(true);

                this.player1.honor = 11;
                this.player2.honor = 11;

                this.flow.finishConflictPhase();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});

