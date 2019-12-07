describe('Daidoji Harrier', function() {
    integration(function() {
        describe('Daidoji Harrier\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-harrier']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['ornate-fan', 'fine-katana', 'banzai']
                    }
                });

                this.harrier = this.player1.findCardByName('daidoji-harrier');
                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.fan = this.player2.findCardByName('ornate-fan');
                this.katana = this.player2.findCardByName('fine-katana');
                this.banzai = this.player2.findCardByName('banzai');
            });

            it('should prompt after you win a military conflict on attack', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.harrier],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.harrier);
            });

            it('should prompt after you win a military conflict on defense', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.harrier]
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.harrier);
            });

            it('should not prompt after you win a political conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.harrier],
                    defenders: [],
                    type: 'political'
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not prompt if your opponent has less than 2 cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.harrier],
                    defenders: []
                });
                this.player2.playAttachment(this.fan, this.whisperer);
                this.player1.pass();
                this.player2.playAttachment(this.katana, this.whisperer);
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should prompt your opponent to choose two cards in their hand', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.harrier],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickCard(this.harrier);
                expect(this.player2).toHavePrompt('Choose two cards to reveal');
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.banzai);

                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.banzai);
                this.player2.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Select a card:');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Banzai!');

                this.player1.clickPrompt('Ornate Fan');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.getChatLogs(3)).toContain('player1 chooses Ornate Fan to be discarded from Ornate Fan and Banzai!');
            });
        });
    });
});

