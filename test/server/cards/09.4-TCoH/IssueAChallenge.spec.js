describe('Issue a Challenge', function() {
    integration(function() {
        describe('Issue a Challenge\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'callow-delegate'],
                        hand: ['issue-a-challenge']
                    },
                    player2: {
                        inPlay: ['shrine-maiden', 'henshin-disciple']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.callowDelegate = this.player1.findCardByName('callow-delegate');
                this.issueAChallenge = this.player1.findCardByName('issue-a-challenge');

                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.henshinDisciple = this.player2.findCardByName('henshin-disciple');

                this.noMoreActions();
            });

            it('should not let more than 1 card defend if you attack with 1 character that is a bushi', function() {
                this.initiateConflict({
                    attackers: [this.brashSamurai]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.issueAChallenge);
                this.player1.clickCard(this.issueAChallenge);

                this.player2.clickCard(this.shrineMaiden);
                this.player2.clickCard(this.henshinDisciple);
                this.player2.clickPrompt('Done');

                expect(this.game.currentConflict.defenders.length).toBe(1);
                expect(this.game.currentConflict.defenders).toContain(this.shrineMaiden);
            });

            it('should not be able to be triggered with 2 attacking characters', function() {
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.callowDelegate]
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not be able to be triggered with a non-bushi', function() {
                this.initiateConflict({
                    attackers: [this.callowDelegate]
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
