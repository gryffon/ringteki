describe('Shosuro Takao', function() {
    integration(function() {
        describe('Shosuro Takao\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-takao','yogo-outcast']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.yogo = this.player1.findCardByName('yogo-outcast');
                this.takao = this.player1.findCardByName('shosuro-takao');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should not work if no dishonored character are participating in the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['yogo-outcast'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shosuro-takao');
                expect(this.takao.inConflict).toBe(false);
            });

            it('should only work if a dishonored character is participating in the conflict', function() {
                this.yogo.dishonor();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['yogo-outcast'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shosuro-takao');
                expect(this.takao.inConflict).toBe(true);
            });

            it('should work if a dishonored opponent character is participating in the conflict', function() {
                this.whisperer.dishonor();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.player1.pass();
                this.player2.pass();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    defenders: []
                });
                this.player1.clickCard('shosuro-takao');
                expect(this.takao.inConflict).toBe(true);
            });

            it('should work if Takao is dishonored and participating in the conflict', function() {
                this.takao.dishonor();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['shosuro-takao'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shosuro-takao');
                expect(this.takao.inConflict).toBe(false);
            });
        });
    });
});
