describe('Yasuki Hatsu', function() {
    integration(function() {
        describe('Yasuki Hatsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yasuki-hatsu'],
                        conflictDeck: ['hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan'],
                        conflictDeckSize: 5
                    },
                    player2: {
                        honor: 20
                    }
                });
                this.hatsu = this.player1.findCardByName('yasuki-hatsu');
                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hatsu],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should prompt tp choose from the top 5 cards for an attachment', function() {
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePrompt('Select a card to reveal and put in your hand');
                expect(this.player1).toHaveDisabledPromptButton('Hurricane Punch');
                expect(this.player1).toHavePromptButton('Centipede Tattoo');
                expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
                expect(this.player1).toHaveDisabledPromptButton('Censure');
                expect(this.player1).toHavePromptButton('Ornate Fan');
            });

            it('should reveal the chosen attachment', function() {
                this.player1.clickCard(this.hatsu);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(4)).toContain('player1 takes Ornate Fan and adds it to their hand');
            });

            it('should add the chosen card to your hand', function() {
                this.player1.clickCard(this.hatsu);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.ornateFan.location).toBe('hand');
            });

            it('should shuffle the conflict deck', function() {
                this.player1.clickCard(this.hatsu);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
            });

            it('should allow you to choose to take nothing', function() {
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(4)).toContain('player1 takes nothing');
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
            });
        });

        describe('Yasuki Hatsu\'s ability (exclusion criteria)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yasuki-hatsu', 'togashi-initiate'],
                        conflictDeck: ['hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan'],
                        conflictDeckSize: 5
                    },
                    player2: {
                        honor: 20
                    }
                });
                this.hatsu = this.player1.findCardByName('yasuki-hatsu');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
            });

            it('should not trigger outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if more honorable', function() {
                this.player1.honor = 10;
                this.player2.honor = 9;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hatsu],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if equally honorable', function() {
                this.player1.honor = 10;
                this.player2.honor = 10;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hatsu],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['togashi-initiate'],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hatsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
