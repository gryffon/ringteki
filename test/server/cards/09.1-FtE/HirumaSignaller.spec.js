describe('Hiruma Signaller', function() {
    integration(function() {
        describe('Hiruma Signaller\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-raitsugu', 'agasha-swordsmith'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['hiruma-signaller','hida-yakamo'],
                        hand: ['reprieve']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.hirumaSignaller = this.player2.findCardByName('hiruma-signaller');
                this.hidaYakamo = this.player2.findCardByName('hida-yakamo');
                this.reprieve = this.player2.findCardByName('reprieve');
                this.spy = spyOn(this.flow.game, 'addMessage');

                this.noMoreActions();
            });

            it('should ready a character at home and move to the conflict', function() {
                this.hidaYakamo.bow();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller]
                });
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).toHavePrompt('Hiruma Signaller');
                expect(this.player2).toBeAbleToSelect(this.hidaYakamo);
                this.player2.clickCard(this.hidaYakamo);
                expect(this.hidaYakamo.bowed).toBe(false);
                expect(this.hidaYakamo.inConflict).toBe(true);
                expect(this.hirumaSignaller.location).toBe('dynasty discard pile');
            });

            it('should ready a character in the conflict', function() {
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller, this.hidaYakamo]
                });
                this.hidaYakamo.bow();
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).toHavePrompt('Hiruma Signaller');
                expect(this.player2).toBeAbleToSelect(this.hidaYakamo);
                this.player2.clickCard(this.hidaYakamo);
                expect(this.hidaYakamo.bowed).toBe(false);
                expect(this.hidaYakamo.inConflict).toBe(true);
                expect(this.hirumaSignaller.location).toBe('dynasty discard pile');
            });

            it('should move a ready character to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller]
                });
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).toHavePrompt('Hiruma Signaller');
                expect(this.player2).toBeAbleToSelect(this.hidaYakamo);
                this.player2.clickCard(this.hidaYakamo);
                expect(this.hidaYakamo.bowed).toBe(false);
                expect(this.hidaYakamo.inConflict).toBe(true);
                expect(this.hirumaSignaller.location).toBe('dynasty discard pile');
            });

            it('should not ready a character at home and move to the conflict if the sacrifice is prevented', function() {
                this.hidaYakamo.bow();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller]
                });
                this.player2.playAttachment(this.reprieve, this.hirumaSignaller);
                this.player1.pass();
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).toBeAbleToSelect(this.hidaYakamo);
                this.player2.clickCard(this.hidaYakamo);
                expect(this.player2).toBeAbleToSelect(this.reprieve);
                this.player2.clickCard(this.reprieve);
                expect(this.hidaYakamo.bowed).toBe(true);
                expect(this.hidaYakamo.inConflict).toBe(false);
                expect(this.hirumaSignaller.location).toBe('play area');
            });

            it('should be able to target itself', function() {
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller, this.hidaYakamo]
                });
                this.hirumaSignaller.bow();
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).toBeAbleToSelect(this.hirumaSignaller);
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.hirumaSignaller.location).toBe('dynasty discard pile');
                expect(this.spy).toHaveBeenCalledWith('{0} attempted to use {1}, but there are insufficient legal targets', this.player2.player, this.hirumaSignaller);
            });

            it('should not able to choose an opponent\'s character', function() {
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller]
                });
                this.mirumotoRaitsugu.bow();
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
            });

            it('should not be able to trigger if there is no legal target', function() {
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.hirumaSignaller, this.hidaYakamo]
                });
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).not.toHavePrompt('Hiruma Signaller');
            });

            it('should not be able to trigger while attacking', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaSignaller],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player1.pass();
                this.player2.clickCard(this.hirumaSignaller);
                expect(this.player2).not.toHavePrompt('Hiruma Signaller');
            });
        });
    });
});
