describe('Ardent Omoidasu', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ardent-omoidasu'],
                    honor: 10
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['way-of-the-scorpion'],
                    honor: 10,
                    provinces: ['shameful-display']
                }
            });

            this.ardentOmoidasu = this.player1.findCardByName('ardent-omoidasu');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('should allow to trigger on opponents dishonoring your characters with events', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.ardentOmoidasu],
                defenders: [this.mirumotoRaitsugu],
                province: this.shamefulDisplay,
                ring: 'fire'
            });

            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.ardentOmoidasu);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ardentOmoidasu);

            this.player1.clickCard(this.ardentOmoidasu);
            expect(this.player1.honor).toBe(12);
            expect(this.player2.honor).toBe(8);
        });

        it('should allow to trigger on opponents dishonoring your characters with a card ability', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.ardentOmoidasu],
                defenders: [this.mirumotoRaitsugu],
                province: this.shamefulDisplay,
                ring: 'fire'
            });

            this.player2.clickCard(this.shamefulDisplay);
            this.player2.clickCard(this.ardentOmoidasu);
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('honor');
            this.player2.clickCard(this.mirumotoRaitsugu);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ardentOmoidasu);

            this.player1.clickCard(this.ardentOmoidasu);
            expect(this.player1.honor).toBe(12);
            expect(this.player2.honor).toBe(8);
        });

        it('should allow to trigger when a character gets dishonored by a ring effect', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                defenders: [this.ardentOmoidasu],
                attackers: [this.mirumotoRaitsugu],
                ring: 'fire'
            });

            this.noMoreActions();

            this.player2.clickCard(this.ardentOmoidasu);
            this.player2.clickPrompt('Dishonor Ardent Omoidasu');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ardentOmoidasu);

            this.player1.clickCard(this.ardentOmoidasu);
            expect(this.player1.honor).toBe(12);
            expect(this.player2.honor).toBe(8);
        });

        it('should not allow to trigger when the controller itself dishonors him', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.ardentOmoidasu],
                defenders: [this.mirumotoRaitsugu],
                province: this.shamefulDisplay,
                ring: 'fire'
            });

            this.noMoreActions();

            this.player1.clickCard(this.ardentOmoidasu);
            this.player1.clickPrompt('Dishonor Ardent Omoidasu');

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be allowed to trigger if the opponent dishonors their own character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.ardentOmoidasu],
                defenders: [this.mirumotoRaitsugu],
                province: this.shamefulDisplay,
                ring: 'fire'
            });

            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.mirumotoRaitsugu);

            expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
