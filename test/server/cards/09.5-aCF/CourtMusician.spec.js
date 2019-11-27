describe('Court Musician', function() {
    integration(function() {
        describe('Court Musician\'s ability for regular actions', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: ['bayushi-kachiko', 'against-the-waves', 'clarity-of-purpose'],
                        fate: 10
                    },
                    player2: {
                        inPlay: ['court-musician'],
                        hand: ['earth-becomes-sky', 'mirumoto-daisho', 'festival-for-the-fortunes'],
                        fate: 10
                    }
                });

                this.solemn = this.player1.findCardByName('solemn-scholar');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');
                this.clarity = this.player1.findCardByName('clarity-of-purpose');

                this.courtMusician = this.player2.findCardByName('court-musician');
                this.ebs = this.player2.findCardByName('earth-becomes-sky');
                this.daisho = this.player2.findCardByName('mirumoto-daisho');
                this.festival = this.player2.findCardByName('festival-for-the-fortunes');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.solemn],
                    defenders: [this.courtMusician]
                });

                this.solemn.bowed = true;
            });

            it('should decrease the cost of the next actions by each player by 1. (event/attachment)', function () {
                this.player2.clickCard(this.courtMusician);

                this.player1.clickCard(this.clarity);
                this.player1.clickCard(this.solemn);

                expect(this.player1.fate).toBe(10);

                this.player2.clickCard(this.daisho);
                this.player2.clickCard(this.courtMusician);

                expect(this.player2.fate).toBe(9);

                this.player1.clickCard(this.kachiko);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');

                expect(this.player1.fate).toBe(5);

                this.player2.clickCard(this.festival);

                expect(this.player2.fate).toBe(6);
            });

            it('should decrease the cost of the next actions by each player by 1. (conflict character)', function () {
                this.player2.clickCard(this.courtMusician);

                this.player1.clickCard(this.kachiko);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');

                expect(this.player1.fate).toBe(6);

                this.player2.clickCard(this.festival);
                this.player2.clickCard(this.courtMusician);

                expect(this.player2.fate).toBe(8);
            });

            it('should also decrease the cost of any interrupts/reactions during the next action opportunities by each player by 1.', function () {
                this.player2.clickCard(this.courtMusician);

                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.solemn);
                expect(this.player1.fate).toBe(10);
                this.player2.clickCard(this.ebs);
                expect(this.player2.fate).toBe(10);

                expect(this.solemn.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

