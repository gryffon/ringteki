describe('Social Puppeteer', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['social-puppeteer', 'miya-mystic'],
                    dynastyDiscard: ['social-puppeteer'],
                    hand: ['charge', 'above-question']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'agasha-swordsmith'],
                    hand: ['banzai', 'court-games', 'harmonize', 'ornate-fan']
                }
            });

            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.socialPuppeteer = this.player1.findCardByName('social-puppeteer', 'play area');
            this.socialPuppeteer2 = this.player1.findCardByName('social-puppeteer', 'dynasty discard pile');
            this.player1.placeCardInProvince(this.socialPuppeteer2);
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            this.banzai = this.player2.findCardByName('banzai');
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 3;
            this.noMoreActions();
        });

        it('should switch honor dials when her action is used', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            expect(this.player1.player.showBid).toBe(3);
            expect(this.player2.player.showBid).toBe(5);
            expect(this.player1.player.hasComposure()).toBe(true);
        });

        it('should not have to be selected when controller does not have composure', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Banzai!');
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).toBeAbleToSelect(this.miyaMystic);
            expect(this.player2).toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).toBeAbleToSelect(this.agashaSwordsmith);
        });

        it('should not have to be selected by opponent\'s attachments', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard('ornate-fan');
            expect(this.player2).toHavePrompt('Ornate Fan');
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).toBeAbleToSelect(this.miyaMystic);
            expect(this.player2).toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).toBeAbleToSelect(this.agashaSwordsmith);
        });

        it('should have to be selected by opponent\'s events', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Banzai!');
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
            this.player2.clickCard(this.socialPuppeteer);
            this.player2.clickPrompt('Done');
            expect(this.socialPuppeteer.militarySkill).toBe(3);
        });

        it('should have to be selected by Court Games', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard('court-games');
            this.player2.clickPrompt('Dishonor an opposing character');
            expect(this.player1).toHavePrompt('Court Games');
            expect(this.player1).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
        });

        it('should have to be selected by Harmonize only when it is a legal target', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard('harmonize');
            expect(this.player2).toHavePrompt('Harmonize');
            expect(this.player2).toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).toBeAbleToSelect(this.agashaSwordsmith);
            expect(this.player2).not.toBeAbleToSelect(this.socialPuppeteer);
            this.player2.clickCard(this.mirumotoRaitsugu);
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).not.toBeAbleToSelect(this.miyaMystic);
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard('harmonize');
            this.player2.clickCard(this.agashaSwordsmith);
            expect(this.player2).not.toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).toBeAbleToSelect(this.miyaMystic);
        });

        it('should not be able to be selected when it has Above Question', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.playAttachment('above-question', this.socialPuppeteer);
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Banzai!');
            expect(this.player2).not.toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).toBeAbleToSelect(this.miyaMystic);
            expect(this.player2).toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).toBeAbleToSelect(this.agashaSwordsmith);
        });

        it('should be able to select either puppeteer when two are in play', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.socialPuppeteer, this.miyaMystic],
                defenders: [this.mirumotoRaitsugu, this.agashaSwordsmith]
            });
            this.player2.pass();
            this.player1.clickCard('charge');
            expect(this.player1).toHavePrompt('Charge!');
            expect(this.player1).toBeAbleToSelect(this.socialPuppeteer2);
            this.player1.clickCard(this.socialPuppeteer2);
            expect(this.socialPuppeteer2.inConflict).toBe(true);
            this.player2.pass();
            this.player1.clickCard(this.socialPuppeteer);
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Banzai!');
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer);
            expect(this.player2).toBeAbleToSelect(this.socialPuppeteer2);
            expect(this.player2).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
            expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
            this.player2.clickCard(this.socialPuppeteer);
            this.player2.clickPrompt('Done');
            expect(this.socialPuppeteer.militarySkill).toBe(3);
        });
    });
});
