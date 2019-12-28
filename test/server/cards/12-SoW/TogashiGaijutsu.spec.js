describe('Togashi Gaijutsu', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-gaijutsu', 'togashi-mitsu'],
                    hand: ['centipede-tattoo', 'fine-katana']
                },
                player2: {
                    inPlay: ['togashi-kazue'],
                    hand: ['centipede-tattoo']
                }
            });

            this.gaijutsu = this.player1.findCardByName('togashi-gaijutsu');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.p1Tattoo = this.player1.findCardByName('centipede-tattoo');
            this.katana = this.player1.findCardByName('fine-katana');

            this.kazue = this.player2.findCardByName('togashi-kazue');
            this.p2Tattoo = this.player2.findCardByName('centipede-tattoo');

            this.mitsu.bowed = true;
            this.kazue.bowed = true;
        });

        it('should allow readying a character after attaching a tattoo', function() {
            this.player1.clickCard(this.p1Tattoo);
            this.player1.clickCard(this.mitsu);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.gaijutsu);
            this.player1.clickCard(this.gaijutsu);
            expect(this.mitsu.bowed).toBe(false);
        });

        it('should allow readying an opponent\'s character after attaching a tattoo', function() {
            this.player1.clickCard(this.p1Tattoo);
            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.gaijutsu);
            this.player1.clickCard(this.gaijutsu);
            expect(this.kazue.bowed).toBe(false);
        });

        it('should not react if character is already standing', function() {
            this.player1.clickCard(this.p1Tattoo);
            this.player1.clickCard(this.gaijutsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not react if opponent plays a tattoo', function() {
            this.player1.pass();
            this.player2.clickCard(this.p2Tattoo);
            this.player2.clickCard(this.mitsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not react from non-tattoos', function() {
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.mitsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
