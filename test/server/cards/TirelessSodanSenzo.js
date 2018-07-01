describe('Tireless Sodan Senzo', function() {
    integration(function() {
        describe('Tireless Sodan Senzo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tireless-sodan-senzo']
                    },
                    player2: {
                        inPlay: ['akoko-toturi'],
                        provinces: ['shameful-display']
                    }
                });
                this.senzo = this.player1.findCardByName('tireless-sodan-senzo');
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.noMoreActions();
            });

            it('should not bow after losing a conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.shamefulDisplay,
                    attackers: [this.senzo],
                    defenders: [this.toturi],
                    jumpTo: 'afterConflict'
                });
                expect(this.senzo.bowed).toBe(false);
            });
        });
    });
});
