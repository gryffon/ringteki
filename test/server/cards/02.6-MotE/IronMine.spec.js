describe('Iron Mine', function() {
    integration(function() {
        describe('Iron Mine\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        dynastyDiscard: ['iron-mine'],
                        hand: ['assassination']
                    }
                });
                this.ironMine = this.player1.placeCardInProvince('iron-mine', 'province 1');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.assassination = this.player1.findCardByName('assassination');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
                this.player2.pass();

                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.matsuBerserker);
            });

            it('should be able to be used when a character you control is leaving play', function () {
                expect(this.player1).toBeAbleToSelect(this.ironMine);
            });

            describe('if it resolves', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.ironMine);
                });

                it('should prevent the character from leaving play', function () {
                    expect(this.matsuBerserker.location).toBe('play area');
                });

                it('should sacrifice itself', function () {
                    expect(this.ironMine.location).toBe('dynasty discard pile');
                });

                it('should refill the province', function () {
                    this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                    expect(this.newCard).not.toBeUndefined();
                });

            });

        });
    });
});
