describe('Artisan Academy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['artisan-academy'],
                    inPlay: ['doji-whisperer', 'agasha-swordsmith'],
                    hand: ['ornate-fan', 'steward-of-law', 'tattooed-wanderer', 'levy']
                }
            });
            this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
        });

        describe('Before activating Artisan Academy', function() {
            it('should have the top card facedown', function() {
                expect(this.player1.player.isTopConflictCardShown()).toBe(false);
            });
        });

        describe('When activating Artisan Academy', function() {
            it('should turn the top card face up', function() {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.isTopConflictCardShown()).toBe(true);
            });

            it('should add a playable location', function() {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.playableLocations.length).toBe(6);
            });

            it('should make the top card playable if it\'s an attachment', function() {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                expect(this.player1.player.conflictDeck.first()).toBe(this.ornateFan);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).toHavePrompt('Choose a card');

                this.dojiWhisperer = this.player1.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.attachments.toArray()).toContain(this.ornateFan);
            });

            it('should make the top card playable if it\'s a character', function() {
                this.steward = this.player1.moveCard('steward-of-law', 'conflict deck');
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Choose additional fate');

                this.player1.clickPrompt('0');
                expect(this.steward.location).toBe('play area');
            });

            it('should stop the top card being visible once it has been played', function() {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                expect(this.player1.player.conflictDeck.first()).toBe(this.ornateFan);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).toHavePrompt('Choose a card');

                this.dojiWhisperer = this.player1.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.attachments.toArray()).toContain(this.ornateFan);
                expect(this.player1.player.isTopConflictCardShown()).toBe(false);
            });

            it('should stop the top card being visible if the deck is shuffled', function() {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                this.steward = this.player1.moveCard('steward-of-law', 'conflict deck');
                expect(this.player1.player.conflictDeck.first()).toBe(this.steward);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('agasha-swordsmith');
                expect(this.player1).toHavePrompt('Agasha Swordsmith');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.ornateFan.location).toBe('hand');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.player1.player.isTopConflictCardShown()).toBe(false);
            });

            it('should stop the top card being visible once the phase ends', function() {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.isTopConflictCardShown()).toBe(true);
                this.flow.finishConflictPhase();
                expect(this.player1.player.isTopConflictCardShown()).toBe(false);
            });
        });
    });
});
