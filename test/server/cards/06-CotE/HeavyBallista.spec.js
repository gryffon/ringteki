describe('Heavy Ballista', function() {
    integration(function() {
        describe('Heavy Ballista\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['heavy-ballista'],
                        inPlay: ['borderlands-defender'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger','asahina-artisan']
                    }
                });
                this.heavyBallista = this.player1.placeCardInProvince('heavy-ballista', 'province 1');

                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.banzai = this.player1.findCardByName('banzai');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');

                this.dojiWhisperer.fate = 1;
                this.asahinaArtisan.fate = 1;
            });

            it('should not be triggered outside of a military conflict you are defending', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.heavyBallista);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderlandsDefender],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.heavyBallista);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.pass();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    type: 'political',
                    ring: 'earth'
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.heavyBallista);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a military conflict you are defending', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.player1.clickPrompt('Pass Conflict');
                    this.player1.clickPrompt('Yes');
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.dojiWhisperer, this.dojiChallenger, this.asahinaArtisan],
                        defenders: [this.borderlandsDefender],
                        type: 'military'
                    });
                    this.player1.pass();
                    this.player2.clickCard(this.asahinaArtisan);
                    this.player2.clickCard(this.dojiChallenger);
                });

                it('should prompt to select a ready attacking character', function() {
                    this.player1.clickCard(this.heavyBallista);
                    expect(this.player1).toHavePrompt('Choose a character');
                    expect(this.player1).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player1).not.toBeAbleToSelect(this.asahinaArtisan);
                });

                it('should require you to discard a card', function() {
                    this.player1.clickCard(this.heavyBallista);
                    this.player1.clickCard(this.dojiWhisperer);
                    expect(this.player1).toHavePrompt('Select card to discard');
                    expect(this.player1).toBeAbleToSelect(this.banzai);
                    expect(this.player1).not.toBeAbleToSelect(this.borderlandsDefender);
                    expect(this.player1).not.toBeAbleToSelect(this.heavyBallista);
                    this.player1.clickCard(this.banzai);
                    expect(this.banzai.location).toBe('conflict discard pile');
                });

                describe('if a character with fate is chosen', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.heavyBallista);
                        this.player1.clickCard(this.dojiWhisperer);
                        this.player1.clickCard(this.banzai);
                    });

                    it('should prompt its controller to choose', function() {
                        expect(this.player2).toHavePrompt('Select one');
                        expect(this.player2).toHavePromptButton('Bow');
                        expect(this.player2).toHavePromptButton('Remove 1 Fate');
                    });

                    it('if \'Bow\' is chosen it should bow the character', function() {
                        this.player2.clickPrompt('Bow');
                        expect(this.dojiWhisperer.bowed).toBe(true);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('if \'Remove 1 Fate\' is chosen it should bow the character', function() {
                        this.player2.clickPrompt('Remove 1 Fate');
                        expect(this.dojiWhisperer.fate).toBe(0);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });
                });

                describe('if a character with no fate is chosen', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.heavyBallista);
                        this.player1.clickCard(this.dojiChallenger);
                        this.player1.clickCard(this.banzai);
                    });

                    it('should not prompt its controller', function() {
                        expect(this.player2).not.toHavePrompt('Choose an Effect');
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('it should bow the character', function() {
                        expect(this.dojiChallenger.bowed).toBe(true);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });
                });

            });

        });
    });
});
