describe('Feast or Famine', function() {
    integration(function() {
        describe('Feast or Famine\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'shinjo-outrider']
                    },
                    player2: {
                        provinces: ['feast-or-famine'],
                        inPlay: ['togashi-initiate', 'togashi-mendicant'],
                        dynastyDeck: ['doomed-shugenja', 'niten-adept'],
                        hand: ['charge', 'assassination', 'fine-katana']
                    }
                });
                this.feastOrFamine = this.player2.findCardByName('feast-or-famine');
                this.doomedShugenja = this.player2.placeCardInProvince('doomed-shugenja', 'province 1');
                this.nitenAdept = this.player2.placeCardInProvince('niten-adept', 'province 2');
                this.togashiMendicant = this.player2.findCardByName('togashi-mendicant');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
                this.togashiInitiate.modifyFate(1);
                this.shinjoOutrider = this.player1.findCardByName('shinjo-outrider');
                this.shinjoOutrider.modifyFate(2);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-horde'],
                    defenders: []
                });
            });

            //RRG Feast or Famine Errata 2019-10-07: Now only steals 1 fate and can be placed on any target.
            it('should allow the ability to be used regardless of fate or no fate on the character', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.feastOrFamine);
                this.player2.clickCard(this.shinjoOutrider);

                expect(this.player2).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player2).toBeAbleToSelect(this.togashiMendicant);
            });

            it('should not allow the ability to be used if there is no legal target', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.shinjoOutrider.location).toBe('dynasty discard pile');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Feast or Famine');
            });

            it('should not allow the ability to be used if the province is not broken', function() {
                this.player2.clickCard('charge');
                this.nitenAdept = this.player2.clickCard('niten-adept');
                expect(this.nitenAdept.location).toBe('play area');
                expect(this.nitenAdept.inConflict).toBe(true);
                this.player1.pass();
                this.player2.playAttachment('fine-katana', this.nitenAdept);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                expect(this.feastOrFamine.isBroken).toBe(false);
            });

            it('should allow the ability to be used if there is a target outside the conflict', function() {
                this.player2.clickCard('charge');
                this.nitenAdept = this.player2.clickCard('niten-adept');
                expect(this.nitenAdept.location).toBe('play area');
                expect(this.nitenAdept.inConflict).toBe(true);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('feast-or-famine');
                this.feastOrFamine = this.player2.clickCard('feast-or-famine');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player2).toBeAbleToSelect(this.nitenAdept);
                this.player2.clickCard(this.nitenAdept);
                expect(this.shinjoOutrider.fate).toBe(1);
                expect(this.nitenAdept.fate).toBe(1);
                expect(this.feastOrFamine.isBroken).toBe(true);
            });

            it('should allow the ability to be used if there is a target inside the conflict', function() {
                this.player2.clickCard('charge');
                this.nitenAdept = this.player2.clickCard('niten-adept');
                expect(this.nitenAdept.location).toBe('play area');
                expect(this.nitenAdept.inConflict).toBe(true);
                this.player1.clickCard(this.shinjoOutrider);
                expect(this.shinjoOutrider.inConflict).toBe(true);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('feast-or-famine');
                this.feastOrFamine = this.player2.clickCard('feast-or-famine');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player2).toBeAbleToSelect(this.nitenAdept);
                expect(this.player2).not.toBeAbleToSelect(this.doomedShugenja);
                this.player2.clickCard(this.nitenAdept);
                expect(this.shinjoOutrider.fate).toBe(1);
                expect(this.nitenAdept.fate).toBe(1);
                expect(this.feastOrFamine.isBroken).toBe(true);
            });

            it('should allow the ability to be used to place fate on a target outside the conflict', function() {
                this.togashiInitiate.fate = 0;
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('feast-or-famine');
                this.feastOrFamine = this.player2.clickCard('feast-or-famine');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player2).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player2).not.toBeAbleToSelect(this.doomedShugenja);
                this.player2.clickCard(this.togashiInitiate);
                expect(this.shinjoOutrider.fate).toBe(1);
                expect(this.togashiInitiate.fate).toBe(1);
                expect(this.feastOrFamine.isBroken).toBe(true);
            });

            it('should allow the ability to be used to place fate on Doomed Shugenja', function() {
                this.player2.clickCard('charge');
                this.nitenAdept = this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.location).toBe('play area');
                expect(this.doomedShugenja.inConflict).toBe(true);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('feast-or-famine');
                this.feastOrFamine = this.player2.clickCard('feast-or-famine');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                this.player2.clickCard(this.doomedShugenja);
                expect(this.shinjoOutrider.fate).toBe(1);
                expect(this.doomedShugenja.fate).toBe(1);
                expect(this.feastOrFamine.isBroken).toBe(true);
            });
        });
    });
});
