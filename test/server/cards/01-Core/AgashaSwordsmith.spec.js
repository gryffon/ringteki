describe('Agasha Swordsmith', function() {
    integration(function() {
        describe('Agasha Swordsmith\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith'],
                        conflictDeck: ['hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan'],
                        conflictDeckSize: 5
                    },
                    player2: {
                    }
                });
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
            });

            it('should prompt tp choose from the top 5 cards for an attachment', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player1).toHavePrompt('Select a card to reveal and put in your hand');
                expect(this.player1).toHaveDisabledPromptButton('Hurricane Punch');
                expect(this.player1).toHavePromptButton('Centipede Tattoo');
                expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
                expect(this.player1).toHaveDisabledPromptButton('Censure');
                expect(this.player1).toHavePromptButton('Ornate Fan');
            });

            it('should reveal the chosen attachment', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(2)).toContain('player1 takes Ornate Fan and adds it to their hand');
            });

            it('should add the chosen card to your hand', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.ornateFan.location).toBe('hand');
            });

            it('should shuffle the conflict deck', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });

            it('should allow you to choose to take nothing', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(2)).toContain('player1 takes nothing');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });
        });
    });
});
