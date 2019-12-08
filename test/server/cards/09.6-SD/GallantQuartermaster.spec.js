describe('Gallant Quartermaster', function() {
    integration(function() {
        describe('Gallant Quartermaster\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender'],
                        hand: ['assassination', 'way-of-the-crab']
                    },
                    player2: {
                        inPlay: ['gallant-quartermaster'],
                        hand: ['way-of-the-crab']

                    }
                });
                this.defender = this.player1.findCardByName('borderlands-defender');
                this.assassination = this.player1.findCardByName('assassination');
                this.crab1 = this.player1.findCardByName('way-of-the-crab');

                this.quartermaster = this.player2.findCardByName('gallant-quartermaster');
                this.crab2 = this.player2.findCardByName('way-of-the-crab');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.defender],
                    defenders: [this.quartermaster]
                });
            });

            it('should not trigger when character leave play normally', function() {
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.quartermaster);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.quartermaster.location).toBe('dynasty discard pile');
            });

            it('should trigger when character is sacrificed to pay for a cost', function() {
                let fate = this.player2.fate;
                this.player2.clickCard(this.crab2);
                this.player2.clickCard(this.quartermaster);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.quartermaster);
                this.player2.clickCard(this.quartermaster);
                expect(this.quartermaster.location).toBe('dynasty discard pile');
                expect(this.player2.fate).toBe(fate + 1); //+2, -1 for way of the crab
            });

            it('should trigger when character is sacrificed as an effect', function() {
                let fate = this.player2.fate;
                this.player2.pass();
                this.player1.clickCard(this.crab1);
                this.player1.clickCard(this.defender);
                this.player2.clickCard(this.quartermaster);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.quartermaster);
                this.player2.clickCard(this.quartermaster);
                expect(this.quartermaster.location).toBe('dynasty discard pile');
                expect(this.player2.fate).toBe(fate + 2);
            });
        });
    });
});
