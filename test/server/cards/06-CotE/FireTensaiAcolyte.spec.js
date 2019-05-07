describe('Fire Tensai Acolyte', function() {
    integration(function() {
        describe('Fire Tensai Acolyte\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['fire-tensai-acolyte','isawa-masahiro'],
                        dynastyDiscard: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['doji-challenger']
                    }
                });
                this.acolyte = this.player1.findCardByName('fire-tensai-acolyte');
                this.masahiro = this.player1.findCardByName('isawa-masahiro');
                this.favorableground = this.player1.placeCardInProvince('favorable-ground', 'province 1');

                this.duelist = this.player2.findCardByName('doji-challenger');
            });

            it('should not be able to attack during non-fire conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['fire-tensai-acolyte','isawa-masahiro'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.masahiro);
                expect(this.game.currentConflict.attackers).not.toContain(this.acolyte);
            });

            it('should be able to attack during fire conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: ['fire-tensai-acolyte','isawa-masahiro'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.masahiro);
                expect(this.game.currentConflict.attackers).toContain(this.acolyte);
            });

            it('should be able to participate in non-fire conflicts if moved in', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['isawa-masahiro'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.favorableground);
                this.player1.clickCard(this.acolyte);
                expect(this.game.currentConflict.attackers).toContain(this.acolyte);
            });

            it('should let you declare an attack with only the acolyte with the fire ring', function () {
                this.masahiro.bow();
                this.player1.pass();
                this.player2.pass();
                this.player1.clickRing('fire');
                this.player1.clickCard(this.acolyte);
                expect(this.player1).toHavePrompt('Military Fire Conflict');
            });

            it('should not let you pick the fire ring declare acolyte as an attacking then change the ring and keep him in the conflict', function () {
                this.player1.pass();
                this.player2.pass();
                this.player1.clickRing('fire');
                this.player1.clickCard(this.acolyte);
                this.player1.clickRing('void');
                expect(this.game.currentConflict.attackers).not.toContain(this.acolyte);
            });
        });
    });
});
