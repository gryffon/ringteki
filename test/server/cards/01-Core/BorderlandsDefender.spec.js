describe('Borderlands Defender', function () {
    integration(function () {
        describe('Borderlands Defender', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['admit-defeat', 'rout', 'mirumoto-s-fury']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['retreat']
                    }
                });

                this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
                this.admitDefeat = this.player1.findCardByName('admit-defeat');
                this.rout = this.player1.findCardByName('rout');
                this.mirumotosFury = this.player1.findCardByName('mirumoto-s-fury');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.retreat = this.player2.findCardByName('retreat');
                this.noMoreActions();
            });

            it('should not be able to be bowed by opponent\'s card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.pass();
                this.player1.clickCard(this.admitDefeat);
                expect(this.player1).not.toHavePrompt('Admit Defeat');
            });

            it('should not be able to be sent home by opponent\'s card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.pass();
                this.player1.clickCard(this.rout);
                expect(this.player1).not.toHavePrompt('Rout');
            });

            it('should be able to be sent home by your own card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.clickCard(this.retreat);
                expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.isParticipating()).toBe(false);
            });

            it('should be able to be sent home by opponent\'s card effects as an attacker', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderlandsDefender],
                    defenders: [this.togashiYokuni]
                });
                this.player1.clickCard(this.rout);
                expect(this.player1).toBeAbleToSelect(this.borderlandsDefender);
                this.player1.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.isParticipating()).toBe(false);
            });

            it('should be able to be bowed by opponent\'s card effects as an attacker', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderlandsDefender],
                    defenders: [this.togashiYokuni]
                });
                this.player1.clickCard(this.mirumotosFury);
                expect(this.player1).toBeAbleToSelect(this.borderlandsDefender);
                this.player1.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.bowed).toBe(true);
            });
        });
    });
});
