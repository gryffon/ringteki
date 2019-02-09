fdescribe('Leniency', function() {
    integration(function() {
        describe('When playing Leniency', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        dynastyDeck: ['shiba-tsukune', 'shiba-peacemaker', 'naive-student', 'ethereal-dreamer'],
                        hand: ['leniency']
                    }
                });
                this.player1.placeCardInProvince('shiba-tsukune', 'province 1');
                this.player1.placeCardInProvince('shiba-peacemaker', 'province 2');
                this.player1.placeCardInProvince('naive-student', 'province 3');
                this.player1.placeCardInProvince('ethereal-dreamer', 'province 4');
                this.etherealDreamer = this.player1.findCardByName('ethereal-dreamer');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
            });

            it('should let you put uona in to play instead of resolving the ring effect', function () {
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard('leniency');
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.etherealDreamer);
                expect(this.etherealDreamer.location).toBe('in play');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
