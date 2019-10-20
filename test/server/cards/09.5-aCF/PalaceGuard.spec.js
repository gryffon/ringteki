describe('Palace Guard', function() {
    integration(function() {
        describe('Palace Guard\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['palace-guard','yogo-hiroue']
                    },
                    player2: {
                        inPlay: ['doji-challenger']
                    }
                });
                this.palaceGuard = this.player1.findCardByName('palace-guard');
                this.hiroue = this.player1.findCardByName('yogo-hiroue');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
            });

            it('should not be able to declare as an attacker if opponent is less honorable', function() {
                this.player1.honor = 10;
                this.player2.honor = 9;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['palace-guard','yogo-hiroue'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.hiroue);
                expect(this.game.currentConflict.attackers).not.toContain(this.palaceGuard);
            });

            it('should be able to declare as an attacker if opponent is equally honorable', function() {
                this.player1.honor = 10;
                this.player2.honor = 10;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['palace-guard','yogo-hiroue'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.hiroue);
                expect(this.game.currentConflict.attackers).toContain(this.palaceGuard);

            });

            it('should be able to declare as an attacker if opponent is more honorable', function() {
                this.player1.honor = 10;
                this.player2.honor = 10;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['palace-guard','yogo-hiroue'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.hiroue);
                expect(this.game.currentConflict.attackers).toContain(this.palaceGuard);
            });

            it('should be able to participate as an attacker if opponent is less honorable if moved in', function() {
                this.player1.honor = 10;
                this.player2.honor = 9;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['palace-guard','yogo-hiroue'],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.hiroue);
                expect(this.game.currentConflict.attackers).not.toContain(this.palaceGuard);
                this.player2.pass();
                this.player1.clickCard(this.hiroue);
                this.player1.clickCard(this.palaceGuard);
                expect(this.game.currentConflict.attackers).toContain(this.palaceGuard);
            });

            it('should not let you declare an attack with only the palace guard', function () {
                this.hiroue.bow();
                this.player1.honor = 10;
                this.player2.honor = 9;
                this.player1.pass();
                this.player2.pass();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
