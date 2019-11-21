describe('Hida O-Ushi', function() {
    integration(function() {
        describe('Hida O-Ushi\'s Reaction', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan']
                    },
                    player2: {
                        inPlay: ['hida-kisada', 'purifier-apprentice'],
                        hand: ['captive-audience']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.purifier = this.player2.findCardByName('purifier-apprentice');
            });

            it('should trigger if you win on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada]
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player1.honor;
                expect(this.player2).toBeAbleToSelect(this.purifier);
                this.player2.clickCard(this.purifier);
                expect(this.player1.honor).toBe(honor - 1);
            });

            it('should not trigger if you win on attack', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kisada],
                    defenders: [this.kuwanan]
                });

                this.player1.pass();
                this.player2.pass();

                let honor = this.player1.honor;
                expect(this.player2).toBeAbleToSelect(this.purifier);
                this.player2.clickCard(this.purifier);
                expect(this.player1.honor).toBe(honor);
            });

            it('should not trigger if you lose on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada]
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player1.honor;
                expect(this.player2).toBeAbleToSelect(this.purifier);
                this.player2.clickCard(this.purifier);
                expect(this.player1.honor).toBe(honor);
            });
        });
    });
});