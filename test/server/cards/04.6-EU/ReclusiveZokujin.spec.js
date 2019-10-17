describe('Reclusive Zokujin', function() {
    integration(function() {
        describe('Reclusive Zokujin\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['reclusive-zokujin', 'otomo-courtier'],
                        hand: ['tattooed-wanderer', 'let-go', 'calling-in-favors'],
                        dynastyDiscard: ['favorable-ground']
                    },
                    player2: {
                        hand: ['cloud-the-mind', 'misinformation', 'ornate-fan'],
                        inPlay: ['sinister-soshi', 'bayushi-liar', 'steward-of-law']
                    }
                });
                this.player2.player.showBid = 5;
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.reclusiveZokujin = this.player1.findCardByName('reclusive-zokujin');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
            });

            it('should give covert during earth conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                expect(this.player1).toHavePrompt('Choose covert target for Reclusive Zokujin');
            });

            it('should not give covert during other conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should grant immunity during earth conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                this.player1.clickCard(this.bayushiLiar);
                this.player2.clickPrompt('Done');
                this.player2.clickCard('sinister-soshi');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('misinformation');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.otomoCourtier = this.player1.clickCard('otomo-courtier');
                this.player2.clickCard('sinister-soshi');
                expect(this.player2).toHavePrompt('Sinister Soshi');
                expect(this.player2).toBeAbleToSelect(this.otomoCourtier);
                expect(this.player2).not.toBeAbleToSelect(this.reclusiveZokujin);
                this.player2.clickPrompt('Cancel');
                this.player2.clickCard('misinformation');
                expect(this.reclusiveZokujin.politicalSkill).toBe(1);
                expect(this.otomoCourtier.politicalSkill).toBe(1);
            });

            it('should not grant covert or immunity when clouded', function() {
                this.player1.pass();
                this.player2.playAttachment('cloud-the-mind', this.reclusiveZokujin);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
                this.player2.clickPrompt('Done');
                this.player2.clickCard('sinister-soshi');
                expect(this.player2).toHavePrompt('Sinister Soshi');
                expect(this.player2).toBeAbleToSelect(this.reclusiveZokujin);
            });

            it('should retain covert during during an earth conflict when clouded, but lose it subsequently', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                this.player1.clickCard(this.bayushiLiar);
                this.player2.clickPrompt('Done');
                this.player2.playAttachment('cloud-the-mind', this.reclusiveZokujin);
                this.player1.playCharacterFromHand('tattooed-wanderer');
                this.player1.clickPrompt('Home');
                this.player2.clickCard('sinister-soshi');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.reclusiveZokujin);
                this.noMoreActions();
                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.reclusiveZokujin]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
                this.player2.clickPrompt('Done');
                this.player2.clickCard('sinister-soshi');
                expect(this.player2).toHavePrompt('Sinister Soshi');
                expect(this.player2).toBeAbleToSelect(this.reclusiveZokujin);
            });

            it('should not be affected by opposing constant abilities', function() {
                this.player1.pass();
                this.ornateFan = this.player2.playAttachment('ornate-fan', this.bayushiLiar);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin]
                });
                this.player1.clickCard(this.bayushiLiar);
                this.stewardOfLaw = this.player2.clickCard('steward-of-law');
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard('calling-in-favors');
                this.player1.clickPrompt('Pay Costs first');
                expect(this.player1).toBeAbleToSelect(this.reclusiveZokujin);
                expect(this.player1).not.toBeAbleToSelect('otomo-courtier');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.playCharacterFromHand('tattooed-wanderer');
                this.player1.clickPrompt('Home');
            });

            it('should not be affected by opposing constant abilities', function() {
                this.player1.pass();
                this.ornateFan = this.player2.playAttachment('ornate-fan', this.bayushiLiar);
                this.player1.pass();
                this.cloudTheMind = this.player2.playAttachment('cloud-the-mind', this.reclusiveZokujin);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.reclusiveZokujin],
                    defenders: ['steward-of-law']
                });
                this.player2.pass();
                this.player1.clickCard('calling-in-favors');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('let-go');
                this.player1.clickCard(this.cloudTheMind);
                this.player2.pass();
                this.player1.clickCard('calling-in-favors');
                this.player1.clickPrompt('Pay Costs first');
                expect(this.player1).toBeAbleToSelect(this.reclusiveZokujin);
                expect(this.player1).not.toBeAbleToSelect('otomo-courtier');
            });
        });
    });
});
