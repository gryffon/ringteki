describe('Shintao Monastery', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-kazue', 'togashi-initiate'],
                    hand: ['a-new-name', 'void-fist'],
                    dynastyDiscard: ['shintao-monastery', 'shintao-monastery']
                },
                player2: {
                    inPlay: ['togashi-kazue', 'togashi-initiate', 'daidoji-kageyu'],
                    hand: ['a-new-name', 'void-fist']
                }
            });

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.kazue = this.player1.findCardByName('togashi-kazue');
            this.newName = this.player1.findCardByName('a-new-name');
            this.voidFist = this.player1.findCardByName('void-fist');

            this.monastery1 = this.player1.filterCardsByName('shintao-monastery')[0];
            this.monastery2 = this.player1.filterCardsByName('shintao-monastery')[1];

            this.initiate2 = this.player2.findCardByName('togashi-initiate');
            this.kazue2 = this.player2.findCardByName('togashi-kazue');
            this.newName2 = this.player2.findCardByName('a-new-name');
            this.voidFist2 = this.player2.findCardByName('void-fist');
            this.kageyu = this.player2.findCardByName('daidoji-kageyu');
        });

        it('should count as playing a card for the owner', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.kazue],
                defenders: [this.initiate2, this.kazue2],
                type: 'military'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.voidFist);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.placeCardInProvince(this.monastery1, 'province 1');
            this.game.checkGameState(true);
            this.player1.clickCard(this.voidFist);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.placeCardInProvince(this.monastery2, 'province 2');
            this.game.checkGameState(true);
            this.player1.clickCard(this.voidFist);
            expect(this.player1).toHavePrompt('Void Fist');
            expect(this.player1).toBeAbleToSelect(this.kazue, this.kazue2, this.initiate, this.initiate2);
        });

        it('should not count as playing a card for the opponent', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.kazue],
                defenders: [this.initiate2, this.kazue2],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.voidFist2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player1.placeCardInProvince(this.monastery1, 'province 1');
            this.game.checkGameState(true);
            this.player2.clickCard(this.voidFist2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player1.placeCardInProvince(this.monastery2, 'province 2');
            this.game.checkGameState(true);
            this.player2.clickCard(this.voidFist2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should count as playing a card for opponent\'s effects that depend on you playing cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.kazue],
                defenders: [this.initiate2, this.kazue2, this.kageyu],
                type: 'political'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player1.placeCardInProvince(this.monastery1, 'province 1');
            this.player1.placeCardInProvince(this.monastery2, 'province 2');
            this.game.checkGameState(true);

            let hand = this.player2.hand.length;
            this.player2.clickCard(this.kageyu);
            expect(this.player2.hand.length).toBe(hand + 2);
        });
    });
});
