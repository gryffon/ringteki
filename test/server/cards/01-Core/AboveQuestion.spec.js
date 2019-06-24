describe('Above Question', function() {
    integration(function() {
        describe('Above Question on a friendly character', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith', 'doomed-shugenja', 'togashi-initiate'],
                        hand: ['above-question']
                    },
                    player2: {
                        hand: ['court-games', 'assassination']
                    }
                });

                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.aboveQuestion = this.player1.findCardByName('above-question');
                this.courtGames = this.player2.findCardByName('court-games');
                this.assassination = this.player2.findCardByName('assassination');
                this.player1.playAttachment(this.aboveQuestion, this.agashaSwordsmith);
                this.noMoreActions();
            });

            it('should forbid opponent\'s events to target attached character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.agashaSwordsmith],
                    defenders: []
                });
                this.player2.clickCard(this.assassination);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
            });

            it('should forbid opponent\'s events to target attached character, even when chosen by its controller', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.agashaSwordsmith, this.doomedShugenja],
                    defenders: []
                });
                this.player2.clickCard(this.courtGames);
                this.player2.clickPrompt('Dishonor an opposing character');
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
            });
        });

        describe('Above Question on an opponent\'s character', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith'],
                        hand: ['above-question', 'court-games']
                    },
                    player2: {
                        inPlay: ['siege-captain', 'vanguard-warrior'],
                        hand: ['defend-your-honor', 'banzai']
                    }
                });

                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.aboveQuestion = this.player1.findCardByName('above-question');
                this.courtGames = this.player1.findCardByName('court-games');
                this.siegeCaptain = this.player2.findCardByName('siege-captain');
                this.vanguardWarrior = this.player2.findCardByName('vanguard-warrior');
                this.defendYourHonor = this.player2.findCardByName('defend-your-honor');
                this.banzai = this.player2.findCardByName('banzai');
                this.player1.playAttachment(this.aboveQuestion, this.siegeCaptain);
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
            });

            it('should not forbid your own events to target attached character', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.siegeCaptain, this.vanguardWarrior],
                    defenders: []
                });
                this.player1.clickCard(this.courtGames);
                this.player1.clickPrompt('Dishonor an opposing character');
                expect(this.player2).toBeAbleToSelect(this.siegeCaptain);
                expect(this.player2).toBeAbleToSelect(this.vanguardWarrior);
            });

            it('should not forbid opponent\'s events to target attached character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.siegeCaptain, this.vanguardWarrior],
                    defenders: []
                });
                this.player1.pass();
                this.player2.clickCard(this.banzai);
                expect(this.player2).not.toBeAbleToSelect(this.siegeCaptain);
                expect(this.player2).toBeAbleToSelect(this.vanguardWarrior);
            });

            it('should forbid opponent\'s events to target attached character, even when chosen by its controller', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.siegeCaptain, this.vanguardWarrior],
                    defenders: [this.agashaSwordsmith]
                });
                this.player1.clickCard(this.courtGames);
                this.player1.clickPrompt('Honor a friendly character');
                this.player2.clickCard(this.defendYourHonor);
                expect(this.player2).not.toBeAbleToSelect(this.siegeCaptain);
                expect(this.player2).toBeAbleToSelect(this.vanguardWarrior);
            });
        });
    });
});
