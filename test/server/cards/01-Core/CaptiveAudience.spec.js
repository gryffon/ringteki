describe('Captive Audience', function () {
    integration(function () {
        describe('CAptive Audience', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'brash-samurai', 'asahina-takako']
                    },
                    player2: {
                        hand: ['captive-audience']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.asahinaTakako = this.player1.findCardByName('asahina-takako');
                this.captiveAudience = this.player2.findCardByName('captive-audience');
                this.noMoreActions();
            });

            it('should cost 1 honor and switch the conflict type from political to military', function () {
                let honor = this.player2.player.honor;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player2.clickCard(this.captiveAudience);
                expect(this.player2.player.honor).toBe(honor - 1);
                expect(this.game.currentConflict.conflictType).toBe('military');
            });

            it('should send home and bow characters with a dash in military', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.asahinaTakako],
                    defenders: []
                });
                this.player2.clickCard(this.captiveAudience);
                expect(this.asahinaTakako.inConflict).toBe(false);
                expect(this.asahinaTakako.bowed).toBe(true);
            });

            it('should not switch the conflict from military to political', function () {
                let honor = this.player2.player.honor;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player2.clickCard(this.captiveAudience);
                expect(this.player2.player.honor).toBe(honor);
                expect(this.game.currentConflict.conflictType).toBe('military');
            });

            it('should not use up the military conflict opportunity', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.asahinaTakako],
                    defenders: []
                });
                this.player2.clickCard(this.captiveAudience);
                expect(this.player1.player.getConflictOpportunities('total')).toBe(1);
                expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
                expect(this.player1.player.getConflictOpportunities('political')).toBe(0);
            });
        });
    });
});
