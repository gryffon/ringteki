describe('Desolation', function() {
    integration(function() {
        describe('Desolation\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['magistrate-station'],
                        inPlay: ['brash-samurai'],
                        hand: ['desolation', 'fine-katana'],
                        honor: 10
                    },
                    player2: {
                        role: 'keeper-of-void',
                        inPlay: ['shinjo-outrider'],
                        hand: ['talisman-of-the-sun', 'mirumoto-s-fury'],
                        provinces: ['rally-to-the-cause', 'secret-cache', 'fertile-fields','public-forum']
                    }
                });
                this.magistrateStation = this.player1.findCardByName('magistrate-station');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.desolation = this.player1.findCardByName('desolation');
                this.fury = this.player2.findCardByName('mirumoto-s-fury');
                this.player1.playAttachment('fine-katana', 'brash-samurai');
                this.talismanOfTheSun = this.player2.playAttachment('talisman-of-the-sun', 'shinjo-outrider');
                this.magistrateStation.facedown = false;
                this.player1.clickCard(this.desolation);
                this.noMoreActions();
            });

            it('should spend 2 honor to play', function() {
                expect(this.getChatLogs(3)).toContain('player1 plays Desolation, losing 2 honor to blank player2\'s provinces until the end of the phase');
                expect(this.player1.honor).toBe(8);
            });

            it('should not blank own provinces', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'fertile-fields',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.brashSamurai);
                expect(this.brashSamurai.bowed).toBe(true);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.magistrateStation);
                expect(this.player1).toHavePrompt('Magistrate Station');
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on provinces with a reveal reaction', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'rally-to-the-cause',
                    attackers: [this.brashSamurai]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with a declare reaction when they are facedown', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'secret-cache',
                    attackers: [this.brashSamurai]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with a declare reaction when they are faceup', function() {
                this.secretCache = this.player2.findCardByName('secret-cache');
                this.secretCache.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    province: 'secret-cache',
                    attackers: [this.brashSamurai]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should work on provinces with an action', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'fertile-fields',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                expect(this.player2.player.hand.size()).toBe(1);
                this.player2.clickCard('fertile-fields');
                expect(this.player2.player.hand.size()).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on provinces with a reaction to breaking', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'public-forum',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.publicForum = this.player2.findCardByName('public-forum');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Public Forum');
                expect(this.publicForum.isBroken).toBe(true);
            });

            it('should work on provinces after Talisman of the Sun is used', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'public-forum',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.clickCard(this.talismanOfTheSun);
                this.rallyToTheCause = this.player2.clickCard('rally-to-the-cause');
                expect(this.game.currentConflict.conflictProvince).toBe(this.rallyToTheCause);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
