describe('Graceful Guardian', function() {
    integration(function() {
        describe('Graceful Guardian\'s ability for regular actions', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: ['fine-katana', 'against-the-waves'],
                        fate: 4
                    },
                    player2: {
                        inPlay: ['graceful-guardian'],
                        hand: ['way-of-the-crane', 'ornate-fan', 'voice-of-honor'],
                        fate: 4
                    }
                });

                this.solemn = this.player1.findCardByName('solemn-scholar');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');

                this.gracefulGuardian = this.player2.findCardByName('graceful-guardian');
                this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
                this.voiceOfHonor = this.player2.findCardByName('voice-of-honor');
                this.ornateFan = this.player2.findCardByName('ornate-fan');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.solemn],
                    defenders: [this.gracefulGuardian]
                });
            });

            it('should increase the cost of the next actions by each player by 1.', function () {
                this.player2.clickCard(this.gracefulGuardian);

                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.solemn);

                expect(this.player1.fate).toBe(3);

                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.gracefulGuardian);

                expect(this.player2.fate).toBe(3);

                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.solemn);

                expect(this.player1.fate).toBe(2);

                this.player2.clickCard(this.ornateFan);
                this.player2.clickCard(this.gracefulGuardian);

                expect(this.player2.fate).toBe(3);
            });

            it('should also increase the cost of any interrupts/reactions during the next action opportunities by each player by 1.', function () {
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.gracefulGuardian);
                this.player1.pass();

                this.player2.clickCard(this.gracefulGuardian);
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.solemn);

                expect(this.player1.fate).toBe(2);
                this.player2.clickCard(this.voiceOfHonor);
                expect(this.player2.fate).toBe(3);

                expect(this.solemn.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

