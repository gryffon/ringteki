describe('Shosuro Ibuki', function() {
    integration(function() {
        describe('Shosuro Ibuki\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['shosuro-ibuki', 'bayushi-liar'],
                        hand:[]
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'steadfast-witch-hunter']
                    }
                });

                this.shosuroIbuki = this.player1.findCardByName('shosuro-ibuki');
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');

                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.steadfastWitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

                this.noMoreActions();
            });

            it('should trigger after winning a conflict and remove 1 fate from each other participant', function() {
                this.shosuroIbuki.fate = 1;
                this.bayushiLiar.fate = 1;
                this.borderlandsDefender.fate = 1;
                this.steadfastWitchHunter.fate = 1;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroIbuki, this.bayushiLiar],
                    defenders: [this.borderlandsDefender, this.steadfastWitchHunter],
                    province: this.shamefulDisplay
                });
                this.noMoreActions();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.shosuroIbuki);

                expect(this.bayushiLiar.fate).toBe(0);
                expect(this.borderlandsDefender.fate).toBe(0);
                expect(this.steadfastWitchHunter.fate).toBe(0);
                expect(this.shosuroIbuki.fate).toBe(1);
            });
        });
    });
});
