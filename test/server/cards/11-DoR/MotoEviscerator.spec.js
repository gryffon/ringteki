describe('Moto Eviscerator', function() {
    integration(function() {
        describe('Moto Eviscerator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-eviscerator','yogo-outcast']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.yogo = this.player1.findCardByName('yogo-outcast');
                this.moto = this.player1.findCardByName('moto-eviscerator');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should spend an honor to move into the conflict (attack)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogo],
                    defenders: []
                });
                this.player2.pass();
                let honor = this.player1.honor;
                this.player1.clickCard(this.moto);
                expect(this.moto.inConflict).toBe(true);
                expect(this.player1.honor).toBe(honor - 1);
            });

            it('should spend an honor to move into the conflict (defense)', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: []
                });
                let honor = this.player1.honor;
                this.player1.clickCard(this.moto);
                expect(this.moto.inConflict).toBe(true);
                expect(this.player1.honor).toBe(honor - 1);
            });

            it('should not work if already participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.moto],
                    defenders: []
                });
                this.player2.pass();
                let honor = this.player1.honor;
                this.player1.clickCard(this.moto);
                expect(this.moto.inConflict).toBe(true);
                expect(this.player1.honor).toBe(honor);
            });
        });
    });
});
