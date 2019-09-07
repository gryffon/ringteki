describe('Fortified Assembly', function() {
    integration(function() {
        describe('Fortified Assembly\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player2: {
                        inPlay: ['hida-guardian', 'borderlands-defender'],
                        provinces: ['fortified-assembly']
                    },
                    player1: {
                        inPlay: ['bayushi-aramoro']
                    }
                });
                this.hidaGuardian = this.player2.findCardByName('hida-guardian');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');

                this.bayushiAramoro = this.player1.findCardByName('bayushi-aramoro');

                this.fortifiedAssembly = this.player2.findCardByName('fortified-assembly');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiAramoro]
                });
            });

            it('should allow you to trigger fortified assembly if it was attacked', function () {
                expect(this.player2).toBeAbleToSelect(this.fortifiedAssembly);
            });

            it('should allow you to put an honor token on fortified assembly if it was attacked', function () {
                expect(this.player2).toBeAbleToSelect(this.fortifiedAssembly);

                this.player2.clickCard(this.fortifiedAssembly);
                expect(this.fortifiedAssembly.getTokenCount('honor')).toBe(1);
            });

            it('should modify the province strength for each honor token', function () {
                expect(this.player2).toBeAbleToSelect(this.fortifiedAssembly);

                this.player2.clickCard(this.fortifiedAssembly);
                expect(this.fortifiedAssembly.getTokenCount('honor')).toBe(1);
                expect(this.fortifiedAssembly.getStrength()).toBe(5);
            });
        });
    });
});

