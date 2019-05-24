describe('Fifth Tower Watch', function() {
    integration(function() {
        describe('Fifth Tower Watch\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['fifth-tower-watch', 'kaiu-inventor', 'eager-scout'],
                        hand: ['way-of-the-crab']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'daidoji-nerishma'],
                        hand: ['way-of-the-crab', 'hiruma-ambusher']
                    }
                });

                this.fifthTowerWatch = this.player1.findCardByName('fifth-tower-watch');
                this.kaiuInventor = this.player1.findCardByName('kaiu-inventor');
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.daidojiNerishma = this.player2.findCardByName('daidoji-nerishma');
                this.hirumaAmbusher = this.player2.findCardByName('hiruma-ambusher');
                this.wayOfTheCrab2 = this.player2.findCardByName('way-of-the-crab');
            });

            it('should trigger when you sacrifice a character', function() {
                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.fifthTowerWatch);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.fifthTowerWatch);
            });

            it('should trigger when you sacrifice a character even if initiated by an opponent\'s event', function() {
                this.player1.pass();
                this.player2.clickCard(this.hirumaAmbusher);
                this.player2.clickPrompt('0');
                this.player1.pass();
                this.player2.clickCard(this.wayOfTheCrab2);
                this.player2.clickCard(this.hirumaAmbusher);
                this.player1.clickCard(this.kaiuInventor);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.fifthTowerWatch);
            });

            it('should not trigger when your opponent sacrifices a character', function() {
                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.kaiuInventor);
                this.player1.clickPrompt('Pass');
                expect(this.player2).toHavePrompt('Way of the Crab');
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should not trigger if there are no eligible targets', function() {
                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.eagerScout);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Way of the Crab');
            });

            it('should prompt your opponent to choose a character they control with lower military skill', function() {
                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.kaiuInventor);
                this.player1.clickCard(this.fifthTowerWatch);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.fifthTowerWatch);
                expect(this.player2).not.toBeAbleToSelect(this.eagerScout);
                expect(this.player2).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).not.toBeAbleToSelect(this.daidojiNerishma);
            });

            it('should bow the chosen character', function() {
                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.kaiuInventor);
                this.player1.clickCard(this.fifthTowerWatch);
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(true);
                expect(this.getChatLogs(2)).toContain('player1 uses Fifth Tower Watch to bow Doji Whisperer');
            });
        });
    });
});
