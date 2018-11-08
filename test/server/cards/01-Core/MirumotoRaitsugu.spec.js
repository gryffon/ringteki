describe('Mirumoto Raitsugu', function() {
    integration(function() {
        describe('when a character leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['mirumoto-raitsugu']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.obstinateRecruit.fate = 1;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.obstinateRecruit]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
            });

            it('the duel should successfully resolve, but have no effect', function() {
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Mirumoto Raitsugu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-raitsugu','tattooed-wanderer']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should not trigger if he is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.tattooedWanderer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if there is no defender', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mirumotoRaitsugu],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger if he is participating and opponent char too', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toHavePrompt('Mirumoto Raitsugu');
            });

            it('should discard the loser of the duel if they have no fate', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
            });

            it('should remove a fate from the loser if they have fate', function() {
                this.dojiWhisperer.fate = 1;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiWhisperer.fate).toBe(0);
            });
        });
    });
});
