describe('Kyuden Kakita', function() {
    integration(function() {
        describe('kyuden Kakita\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-kakita',
                        inPlay: ['sincere-challenger', 'solemn-scholar']
                    },
                    player2: {
                        inPlay: ['honest-challenger', 'mirumoto-hitomi']
                    }
                });

                this.sincereChallenger = this.player1.findCardByName(
                    'sincere-challenger');
                this.honestChallenger = this.player2.findCardByName(
                    'honest-challenger');
                this.solemnScholar = this.player1.findCardByName(
                    'solemn-scholar');
                this.mirumotoHitomi = this.player2.findCardByName('mirumoto-hitomi');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.sincereChallenger, this.solemnScholar],
                    defenders: [this.honestChallenger, this.mirumotoHitomi]
                });
            });

            it('should let you honor your character after winning a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');

                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toHavePrompt('Kyūden Kakita');
                expect(this.player1).toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

                this.player1.clickCard(this.sincereChallenger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.sincereChallenger.isHonored).toBe(true);
            });

            it('should work for ties', function() {
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toHavePrompt('Kyūden Kakita');
                expect(this.player1).toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

                this.player1.clickCard(this.sincereChallenger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.sincereChallenger.isHonored).toBe(true);
            });

            it('should work if you lose', function() {
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('4');

                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toHavePrompt('Kyūden Kakita');
                expect(this.player1).toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

                this.player1.clickCard(this.sincereChallenger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.sincereChallenger.isHonored).toBe(true);
            });

            it('should trigger from opponent duels', function() {
                this.player2.clickCard(this.honestChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('4');

                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toHavePrompt('Kyūden Kakita');
                expect(this.player1).not.toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);

                this.player1.clickCard(this.solemnScholar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.solemnScholar.isHonored).toBe(true);
            });

            it('should trigger from duels where multiple characters are targeted', function () {
                this.player2.clickCard(this.mirumotoHitomi);
                this.player2.clickCard(this.sincereChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('4');
                this.player2.clickPrompt('4');
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                this.player1.clickPrompt('Dishonor this character');
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                this.player1.clickPrompt('Dishonor this character');
                expect(this.solemnScholar.isDishonored).toBe(true);
                expect(this.sincereChallenger.isDishonored).toBe(true);
                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);
                expect(this.player1).toBeAbleToSelect(this.sincereChallenger);
                this.player1.clickCard(this.solemnScholar);
                expect(this.solemnScholar.isDishonored).toBe(false);
                expect(this.sincereChallenger.isDishonored).toBe(true);
            });
        });
    });
});
