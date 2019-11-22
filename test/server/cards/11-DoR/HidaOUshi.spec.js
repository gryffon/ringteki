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
                        inPlay: ['hida-kisada', 'hida-o-ushi'],
                        hand: ['captive-audience', 'way-of-the-dragon']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.oushi = this.player2.findCardByName('hida-o-ushi');
                this.captive = this.player2.findCardByName('captive-audience');
                this.dragon = this.player2.findCardByName('way-of-the-dragon');

                this.player1.pass();
                this.player2.playAttachment(this.dragon, this.oushi);
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

                let conflicts = this.player2.player.getConflictOpportunities();
                let milConflicts = this.player2.player.getConflictOpportunities('military');
                expect(this.player2).toBeAbleToSelect(this.oushi);
                this.player2.clickCard(this.oushi);
                expect(this.player2.player.getConflictOpportunities()).toBe(conflicts + 1);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(milConflicts + 1);
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

                let conflicts = this.player2.player.getConflictOpportunities();
                let milConflicts = this.player2.player.getConflictOpportunities('military');
                expect(this.player2).not.toBeAbleToSelect(this.oushi);
                this.player2.clickCard(this.oushi);
                expect(this.player2.player.getConflictOpportunities()).toBe(conflicts);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(milConflicts);
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

                let conflicts = this.player2.player.getConflictOpportunities();
                let milConflicts = this.player2.player.getConflictOpportunities('military');
                expect(this.player2).not.toBeAbleToSelect(this.oushi);
                this.player2.clickCard(this.oushi);
                expect(this.player2.player.getConflictOpportunities()).toBe(conflicts);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(milConflicts);
            });

            it('should not be able to trigger more than once', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada]
                });

                this.player2.pass();
                this.player1.pass();

                let conflicts = this.player2.player.getConflictOpportunities();
                let milConflicts = this.player2.player.getConflictOpportunities('military');
                expect(this.player2).toBeAbleToSelect(this.oushi);
                this.player2.clickCard(this.oushi);
                expect(this.player2.player.getConflictOpportunities()).toBe(conflicts + 1);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(milConflicts + 1);

                this.kuwanan.bowed = false;
                this.kisada.bowed = false;

                this.noMoreActions();
                this.player2.passConflict();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    ring: 'fire'
                });

                this.player2.clickCard(this.captive);
                this.player1.pass();
                this.player2.pass();

                conflicts = this.player2.player.getConflictOpportunities();
                milConflicts = this.player2.player.getConflictOpportunities('military');
                expect(this.player2).not.toBeAbleToSelect(this.oushi);
                this.player2.clickCard(this.oushi);
                expect(this.player2.player.getConflictOpportunities()).toBe(conflicts);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(milConflicts);
            });
        });
    });
});

