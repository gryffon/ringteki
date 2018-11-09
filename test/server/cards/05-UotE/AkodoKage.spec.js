describe('Akodo Kage', function() {
    integration(function() {
        describe('Akodo Kage\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['akodo-kage'],
                        hand: []
                    },
                    player2: {
                        hand: []
                    }
                });

                this.akodoKage = this.player1.findCardByName('akodo-kage');
            });

            describe('if your are more honorable than your opponent', function () {
                beforeEach(function () {
                    this.player1.honor = 11;
                    this.player2.honor = 10;
                });

                it('should trigger if your bid is lower than an opponent\'s', function () {
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('2');
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.akodoKage.id);
                });

                it('should not trigger if your bid is equal to an opponent\'s', function () {
                    this.player1.clickPrompt('2');
                    this.player2.clickPrompt('2');
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.player1).not.toBeAbleToSelect(this.akodoKage.id);
                });

                it('should not trigger if your bid is greater than an opponent\'s', function () {
                    this.player1.clickPrompt('3');
                    this.player2.clickPrompt('2');
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.player1).not.toBeAbleToSelect(this.akodoKage.id);
                });
            });

            describe('if your are equal (or less) honorable than your opponent', function () {
                beforeEach(function () {
                    this.player1.honor = 10;
                    this.player2.honor = 10;
                });

                it('should not trigger', function () {
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('2');
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.player1).not.toBeAbleToSelect(this.akodoKage.id);
                });
            });

            describe('if it resolves', function () {
                beforeEach(function () {
                    this.player1.honor = 11;
                    this.player2.honor = 10;
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('2');
                    this.player1.clickCard(this.akodoKage);
                });

                it('should set the opponents\'s dial equal to the controller\'s', function () {
                    expect(this.player2.player.showBid).toBe(this.player1.player.showBid);
                });

            });

        });
    });
});
