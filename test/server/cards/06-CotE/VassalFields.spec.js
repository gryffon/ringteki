describe('Vassal Fields', function() {
    integration(function() {
        describe('Vassal Fields\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yaruma'],
                        fate: 10
                    },
                    player2: {
                        provinces: ['vassal-fields'],
                        fate: 11
                    }
                });
                this.yaruma = this.player1.findCardByName('kitsuki-yaruma');

                this.fields = this.player2.findCardByName('vassal-fields');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yaruma],
                    province: this.fields,
                    defenders: []
                });
            });

            it('should make the opponent lose 1 fate', function() {
                this.player2.clickCard(this.fields);
                expect(this.player1.fate).toBe(9);
                expect(this.player2.fate).toBe(11);
            });
        });
    });
});
