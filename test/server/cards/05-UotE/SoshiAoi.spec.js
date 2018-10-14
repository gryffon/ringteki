describe('Soshi Aoi', function() {
    integration(function() {
        describe('Soshi Aoi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['soshi-aoi','bayushi-aramoro','bayushi-liar'],
                        honor: 7,
                        hand: ['sashimono','tattered-missive']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.aoi = this.player1.findCardByName('soshi-aoi');
                this.aramoro = this.player1.findCardByName('bayushi-aramoro');
                this.sashimono = this.player1.findCardByName('sashimono');
                this.missive = this.player1.findCardByName('tattered-missive');
                this.liar = this.player1.findCardByName('bayushi-liar');
            });

            it('should cost 1 honor', function() {
                this.player1.clickCard(this.aoi);
                expect(this.player1).toHavePrompt('Soshi Aoi');
                this.player1.clickCard(this.aramoro);
                this.player1.clickPrompt('Give +0/+1 and the Courtier trait');
                expect(this.player1.honor).toBe(6);
            });

            it('should correctly give the Courtier trait and +1 POL', function() {
                this.player1.clickCard(this.aoi);
                this.player1.clickCard(this.aramoro);
                this.player1.clickPrompt('Give +0/+1 and the Courtier trait');
                this.player2.pass();
                this.player1.clickCard(this.missive);
                expect(this.player1).toBeAbleToSelect(this.aramoro);
                expect(this.aramoro.politicalSkill).toBe(3);
            });

            it('should correctly give the Bushi trait', function() {
                this.player1.clickCard(this.aoi);
                this.player1.clickCard(this.liar);
                this.player1.clickPrompt('Give +1/+0 and the Bushi trait');
                this.player2.pass();
                this.player1.clickCard(this.sashimono);
                expect(this.player1).toBeAbleToSelect(this.liar);
            });

            it('should correctly give the Bushi trait but not +1 MIL if target has a dash value', function() {
                this.player1.clickCard(this.aoi);
                this.player1.clickCard(this.liar);
                this.player1.clickPrompt('Give +1/+0 and the Bushi trait');
                this.player2.pass();
                this.player1.clickCard(this.sashimono);
                this.player1.clickCard(this.liar);
                expect(this.liar.militarySkill).toBe(0);
            });
        });
    });
});
