describe('Student of War', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-war']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['banzai']
                }
            });
            this.studentOfWar = this.player1.findCardByName('student-of-war');
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.banzai = this.player2.findCardByName('banzai');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.studentOfWar],
                defenders: [this.mirumotoRaitsugu]
            });
        });
        it('should not lose fate if controller has composure', function() {
            this.studentOfWar.fate = 1;
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.studentOfWar);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');
            expect(this.player1.player.hasComposure()).toBe(true);
            expect(this.studentOfWar.fate).toBe(1);
        });
        it('should lose fate if controller loses composure before the duel resolution', function() {
            this.studentOfWar.fate = 1;
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickPrompt('Done');
            this.player1.pass();
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.studentOfWar);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1.player.hasComposure()).toBe(false);
            expect(this.studentOfWar.fate).toBe(0);
        });
        it('should not be discarded if controller has composure', function() {
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.studentOfWar);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');
            expect(this.player1.player.hasComposure()).toBe(true);
            expect(this.studentOfWar.location).toBe('play area');
        });
        it('should be discarded if controller loses composure before the duel resolution', function() {
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickPrompt('Done');
            this.player1.pass();
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.studentOfWar);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1.player.hasComposure()).toBe(false);
            expect(this.studentOfWar.location).toBe('dynasty discard pile');
        });
    });
});
