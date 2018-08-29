describe('Agasha Shunsen', function () {
    integration(function () {
        describe('Agasha Shunsen\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-shunsen'],
                        conflictDeck: ['fine-katana']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['agasha-shunsen'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should not prompt the player to return a ring if none are claimed', function () {
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                expect(this.player1).not.toHavePrompt('Choose a ring to return');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not prompt the player to select an attachment if the player chooses to cancel ring selection', function () {
                this.player1.claimRing('earth');
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt the player to return a ring', function () {
                this.player1.claimRing('earth');
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Choose a ring to return');
            });

            it('should prompt the player to choose a card', function () {
                this.player1.claimRing('earth');
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.player1).toHavePrompt('Agasha Shunsen');
            });

            it('should attach the chosen card', function () {
                this.player1.claimRing('earth');
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                this.player1.clickRing('earth');
                this.player1.clickPrompt('Fine Katana');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                expect(this.agashaShunsen.attachments.toArray()).toContain(this.fineKatana);
            });
        });
    });
});
