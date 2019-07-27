describe('Cunning Magistrate', function() {
    integration(function() {
        describe('Cunning Magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['cunning-magistrate', 'adept-of-shadows'],
                        hand: ['way-of-the-scorpion']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['court-games']
                    }
                });

                this.cunningMagistrate = this.player1.findCardByName('cunning-magistrate');
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.courtGames = this.player2.findCardByName('court-games');
            });

            it('should prevent dishonored characters from contributing to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.cunningMagistrate, this.adeptOfShadows],
                    defenders: [this.dojiWhisperer, this.dojiChallenger],
                    type: 'political'
                });
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });

            it('should not prevent itselft contributing to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.cunningMagistrate, this.adeptOfShadows],
                    defenders: [this.dojiWhisperer, this.dojiChallenger],
                    type: 'political'
                });
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
                this.player2.clickCard(this.courtGames);
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.cunningMagistrate);
                expect(this.cunningMagistrate.isDishonored).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(3);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
            });
        });
    });
});
