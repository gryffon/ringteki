describe('Reinforced Plate', function() {
    integration(function() {
        describe('Reinforced Plate\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['reinforced-plate', 'way-of-the-scorpion']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['kirei-ko', 'way-of-the-scorpion', 'assassination']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.p1scorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.p2scorpion = this.player2.findCardByName('way-of-the-scorpion');
                this.kireiko = this.player2.findCardByName('kirei-ko');
                this.reinforcedPlate = this.player1.playAttachment('reinforced-plate', this.brash);
                this.assassination = this.player2.findCardByName('assassination');
                this.noMoreActions();
            });

            it('should make its wearer immune to opponent events during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.p2scorpion);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.brash);
                expect(this.player2).not.toBeAbleToSelect(this.kireiko);
            });

            it('should not make its wearer immune to own events during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.p1scorpion);
                expect(this.player1).toBeAbleToSelect(this.brash);
                this.player1.clickCard(this.brash);
                expect(this.brash.isDishonored).toBe(true);
            });

            it('should not make its wearer immune to opponent events during a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brash],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.p2scorpion);
                expect(this.player2).toBeAbleToSelect(this.brash);
                this.player2.clickCard(this.brash);
                expect(this.brash.isDishonored).toBe(true);
                this.player1.clickCard(this.brash);
                expect(this.player2).toBeAbleToSelect(this.kireiko);
                this.player2.clickCard(this.kireiko);
                expect(this.brash.bowed).toBe(true);
            });

            it('should not make its wearer immune to opponent events if not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.assassination);
                expect(this.player2).toBeAbleToSelect(this.brash);
                this.player2.clickCard(this.brash);
                expect(this.brash.location).toBe('dynasty discard pile');
            });
        });
    });
});
