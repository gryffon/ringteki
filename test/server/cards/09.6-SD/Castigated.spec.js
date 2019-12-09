describe('Castigated', function() {
    integration(function() {
        describe('Castigated\'s play restrictions', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['castigated'],
                        dynastyDiscard: ['imperial-storehouse'],
                        conflictDiscard: ['bayushi-kachiko'],
                        provinces: ['before-the-throne']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger']
                    }
                });
                this.shoju = this.player1.findCardByName('bayushi-shoju');
                this.throne = this.player1.findCardByName('before-the-throne');
                this.castigated = this.player1.findCardByName('castigated');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');

                this.throne.facedown = true;
                this.noMoreActions();
            });

            it('should not be playable without an imperial character', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial holding', function() {
                this.player1.placeCardInProvince(this.storehouse, 'province 1');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial province', function() {
                this.throne.facedown = false;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be playable on a participating character an imperial character', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Castigated');
                expect(this.player1).toBeAbleToSelect(this.shoju);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.kachiko);
            });

            it('should not be playable during a mil conflict', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Castigated\'s play restrictions', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['castigated'],
                        dynastyDiscard: ['imperial-storehouse'],
                        conflictDiscard: ['bayushi-kachiko'],
                        provinces: ['before-the-throne']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger']
                    }
                });
                this.shoju = this.player1.findCardByName('bayushi-shoju');
                this.throne = this.player1.findCardByName('before-the-throne');
                this.castigated = this.player1.findCardByName('castigated');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');

                this.throne.facedown = true;
                this.noMoreActions();
            });

            it('should not be playable without an imperial character', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial holding', function() {
                this.player1.placeCardInProvince(this.storehouse, 'province 1');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial province', function() {
                this.throne.facedown = false;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be playable on a participating character an imperial character', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Castigated');
                expect(this.player1).toBeAbleToSelect(this.shoju);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.kachiko);
            });

            it('should not be playable during a mil conflict', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
