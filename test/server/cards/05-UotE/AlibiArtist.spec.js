describe('Alibi Artist', function() {
    integration(function() {
        describe('Alibi Artist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alibi-artist'],
                        hand: ['reprieve','fine-katana','ornate-fan']
                    },
                    player2: {
                    }
                });
                this.artist = this.player1.findCardByName('alibi-artist');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.reprieve = this.player1.findCardByName('reprieve');
            });

            describe('if the conflict deck is empty', function () {
                beforeEach(function () {
                    this.player1.player.conflictDeck.each(card => {
                        this.player1.player.moveCard(card, 'conflict discard pile');
                    });
                });

                it('should not trigger', function () {
                    this.player1.honor = 4;
                    this.player1.clickCard('alibi-artist');
                    expect(this.player1).not.toHavePrompt('Choose a card to put in your hand');
                });
            });

            describe('if the conflict deck contains 1 card', function() {
                beforeEach(function() {
                    this.player1.honor = 4;
                    this.player1.reduceDeckToNumber('conflict deck', 0);
                    this.player1.moveCard(this.reprieve, 'conflict deck');
                });

                it('should show 1 card only and a \'Take Nothing\' option', function() {
                    this.player1.clickCard('alibi-artist');
                    expect(this.player1).toHavePrompt('Choose a card to put in your hand');
                    expect(this.player1).toHavePromptButton('Reprieve');
                    expect(this.player1).toHavePromptButton('Take Nothing');
                });

                it('should leave the card in the deck if the \'Take Nothing\' option is chosen', function() {
                    let handSize = this.player1.player.hand.size();
                    this.player1.clickCard('alibi-artist');
                    this.player1.clickPrompt('Take Nothing');
                    expect(this.player1.conflictDeck.length).toBe(1);
                    expect(this.player1.player.hand.size()).toBe(handSize);
                    expect(this.getChatLogs(2)).not.toContain('player1 puts a card in their hand');
                    expect(this.getChatLogs(1)).toContain('player1 puts a card on the bottom of their conflict deck');
                });

                it('should put the card in hand if chosen', function() {
                    this.player1.clickCard('alibi-artist');
                    this.player1.clickPrompt('Reprieve');
                    expect(this.player1.conflictDeck.length).toBe(0);
                    expect(this.reprieve.location).toBe('hand');
                    expect(this.getChatLogs(2)).toContain('player1 puts a card in their hand');
                    expect(this.getChatLogs(1)).not.toContain('player1 puts a card on the bottom of their conflict deck');
                });
            });

            describe('if the conflict deck contains 2 cards', function() {
                beforeEach(function() {
                    this.player1.honor = 4;
                    this.player1.reduceDeckToNumber('conflict deck', 0);
                    this.player1.moveCard(this.reprieve, 'conflict deck');
                    this.player1.moveCard(this.fan, 'conflict deck');
                });

                it('should show both cards', function() {
                    this.player1.clickCard('alibi-artist');
                    expect(this.player1).toHavePrompt('Choose a card to put in your hand');
                    expect(this.player1).toHavePromptButton('Reprieve');
                    expect(this.player1).toHavePromptButton('Ornate Fan');
                });

                it('should put the chosen card in hand and the other in the deck', function() {
                    this.player1.clickCard('alibi-artist');
                    this.player1.clickPrompt('Ornate Fan');
                    expect(this.fan.location).toBe('hand');
                    expect(this.reprieve.location).toBe('conflict deck');
                });
            });

            it('should only work at 6 honor or less', function() {
                this.player1.honor = 7;
                this.player1.clickCard('alibi-artist');
                expect(this.player1).not.toHavePrompt('Choose a card to put in your hand');
            });

            it('should work at 6 or less honor and correctly put cards in hand and at bottom of conflict deck', function() {
                this.player1.honor = 4;
                this.player1.moveCard(this.reprieve, 'conflict deck');
                this.player1.moveCard(this.fan, 'conflict deck');
                this.player1.clickCard('alibi-artist');
                expect(this.player1).toHavePrompt('Choose a card to put in your hand');
                expect(this.player1).not.toHavePromptButton('Take Nothing');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.fan.location).toBe('hand');
                expect(this.player1.player.conflictDeck.last()).toBe(this.reprieve);
                expect(this.getChatLogs(2)).toContain('player1 puts a card in their hand');
                expect(this.getChatLogs(1)).toContain('player1 puts a card on the bottom of their conflict deck');
            });
        });
    });
});

