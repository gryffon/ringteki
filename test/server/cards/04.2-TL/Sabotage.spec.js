describe('Sabotage', function() {
    integration(function() {
        describe('Sabotage\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender'],
                        hand: ['sabotage']
                    },
                    player2: {
                        inPlay: [],
                        dynastyDiscard: ['favorable-ground']
                    }
                });
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.sabotage = this.player1.findCardByName('sabotage');
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
            });

            it('should not trigger outside of a military conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.sabotage);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderlandsDefender],
                    defenders: [],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.sabotage);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose a card in your opponent\'s provinces', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sabotage);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.favorableGround);
                expect(this.player1).toBeAbleToSelect(this.player2.provinces['province 2'].dynastyCards[0]);
                expect(this.player1).toBeAbleToSelect(this.player2.provinces['province 3'].dynastyCards[0]);
                expect(this.player1).toBeAbleToSelect(this.player2.provinces['province 4'].dynastyCards[0]);
                expect(this.player1).not.toBeAbleToSelect(this.player1.provinces['province 1'].dynastyCards[0]);
                expect(this.player1).not.toBeAbleToSelect(this.player1.provinces['province 2'].dynastyCards[0]);
                expect(this.player1).not.toBeAbleToSelect(this.player1.provinces['province 3'].dynastyCards[0]);
                expect(this.player1).not.toBeAbleToSelect(this.player1.provinces['province 4'].dynastyCards[0]);
            });

            it('should discard the chosen card', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sabotage);
                expect(this.favorableGround.location).toBe('province 1');
                this.player1.clickCard(this.favorableGround);
                expect(this.favorableGround.location).toBe('dynasty discard pile');

            });
        });
    });
});
