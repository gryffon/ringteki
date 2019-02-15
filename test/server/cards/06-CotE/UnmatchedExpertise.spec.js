describe('Unmatched Expertise', function() {
    integration(function() {
        describe('Unmatched Expertise\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune'],
                        hand: ['unmatched-expertise']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['for-shame','way-of-the-scorpion']
                    }
                });
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.expertise = this.player1.findCardByName('unmatched-expertise');

                this.forshame = this.player2.findCardByName('for-shame');
                this.wots = this.player2.findCardByName('way-of-the-scorpion');
                this.shoju = this.player2.findCardByName('bayushi-shoju');

                this.player1.clickCard(this.expertise);
                this.player1.clickCard(this.tsukune);
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: ['shiba-tsukune'],
                    defenders: ['bayushi-shoju']
                });
            });

            it('it should prevent being dishonored', function() {
                this.player2.clickCard(this.wots);
                expect(this.player2).not.toHavePrompt('Choose a target');
            });

            it('it should force bow if forshamed', function() {
                this.player2.clickCard(this.forshame);
                this.player2.clickCard(this.tsukune);
                expect(this.tsukune.bowed).toBe(true);
            });

            it('it should allow going from honored to normal', function() {
                this.tsukune.honor();
                expect(this.tsukune.isHonored).toBe(true);
                this.player2.clickCard(this.wots);
                expect(this.player2).toBeAbleToSelect(this.tsukune);
                this.player2.clickCard(this.tsukune);
                expect(this.tsukune.isHonored).toBe(false);
            });

            it('it should be discarded if attached character loses a conflict', function() {
                this.player2.pass();
                this.player1.pass();
                expect(this.expertise.location).toBe('conflict discard pile');
            });

        });
    });
});
