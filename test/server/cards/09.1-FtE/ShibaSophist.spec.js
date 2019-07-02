describe('Shiba Sophist', function() {
    integration(function() {
        describe('Shiba Sophist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-sophist','isawa-kaede'],
                        conflictDeck: ['katana-of-fire','display-of-power','ornate-fan','embrace-the-void','cloud-the-mind'],
                        conflictDeckSize: 5,
                        dynastyDiscard: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['shiba-sophist']
                    }
                });
                this.shibaSophistP1 = this.player1.findCardByName('shiba-sophist');
                this.isawaKaede = this.player1.findCardByName('isawa-kaede');
                this.katanaOfFire = this.player1.findCardByName('katana-of-fire');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.shibaSophistP2 = this.player2.findCardByName('shiba-sophist');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shibaSophistP1],
                    ring: 'fire',
                    defenders: []
                });
            });

            it('should not work if not participating in the conflict', function () {
                this.player2.clickCard(this.shibaSophistP2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work if participating in the conflict', function () {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                expect(this.player1).toHavePrompt('Select a card to reveal and put in your hand');
            });

            it('should prompt to choose from the top 5 cards for a card sharing a trait of the contested ring', function () {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Katana of Fire');
                expect(this.player1).toHavePromptButton('Display of Power');
                expect(this.player1).toHaveDisabledPromptButton('Embrace the Void');
                expect(this.player1).toHaveDisabledPromptButton('Cloud the Mind');
            });

            it('should work if the ring has multiple elements', function () {
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.isawaKaede);
                expect(this.isawaKaede.inConflict).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Katana of Fire');
                expect(this.player1).toHavePromptButton('Display of Power');
                expect(this.player1).toHavePromptButton('Embrace the Void');
                expect(this.player1).toHaveDisabledPromptButton('Cloud the Mind');
            });

            it('should reveal the chosen attachment', function() {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                this.player1.clickPrompt('Katana of Fire');
                expect(this.getChatLogs(4)).toContain('player1 takes Katana of Fire and adds it to their hand');
            });

            it('should add the chosen card to your hand', function() {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                this.player1.clickPrompt('Katana of Fire');
                expect(this.katanaOfFire.location).toBe('hand');
            });

            it('should shuffle the conflict deck', function() {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                this.player1.clickPrompt('Katana of Fire');
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
            });

            it('should allow you to choose to take nothing', function() {
                this.player2.pass();
                this.player1.clickCard(this.shibaSophistP1);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(4)).toContain('player1 takes nothing');
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
            });
        });
    });
});
