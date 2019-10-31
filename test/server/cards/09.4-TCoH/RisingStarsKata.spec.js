describe('Rising Stars Kata', function() {
    integration(function() {
        describe('Rising Stars Kata\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-hitomi'],
                        hand: ['rising-stars-kata', 'rising-stars-kata']
                    },
                    player2: {
                        inPlay: ['shrine-maiden']
                    }
                });
                this.mirumotoHitomi = this.player1.findCardByName('mirumoto-hitomi');
                this.risingStarsKata = this.player1.findCardByName('rising-stars-kata');
                this.risingStarsKata2 = this.player1.findCardByName('rising-stars-kata');

                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.shrineMaiden]
                });
            });

            it('should give +3 military if the target has not won a duel this conflict', function () {
                this.player2.pass();

                this.player1.clickCard(this.risingStarsKata);
                this.player1.clickCard(this.mirumotoHitomi);
                expect(this.mirumotoHitomi.getMilitarySkill()).toBe(7);
                expect(this.getChatLogs(6)).toContain('player1 plays Rising Stars Kata to give Mirumoto Hitomi +3 military skill until the end of the conflict');
            });

            it('should give +5 military if the target has won a duel this conflict', function () {
                this.player2.pass();

                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.shrineMaiden);
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.clickPrompt('Dishonor this character');

                this.player2.pass();

                this.player1.clickCard(this.risingStarsKata);
                this.player1.clickCard(this.mirumotoHitomi);

                expect(this.mirumotoHitomi.getMilitarySkill()).toBe(9);
                expect(this.getChatLogs(6)).toContain('player1 plays Rising Stars Kata to give Mirumoto Hitomi +5 military skill until the end of the conflict');
            });

            it('should only allow you to play 1 per conflict', function () {
                this.player2.pass();

                this.player1.clickCard(this.risingStarsKata);
                this.player1.clickCard(this.mirumotoHitomi);
                expect(this.mirumotoHitomi.getMilitarySkill()).toBe(7);
                expect(this.getChatLogs(6)).toContain('player1 plays Rising Stars Kata to give Mirumoto Hitomi +3 military skill until the end of the conflict');

                this.player2.pass();

                this.player1.clickCard(this.risingStarsKata2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

