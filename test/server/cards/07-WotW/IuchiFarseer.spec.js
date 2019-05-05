describe('Iuchi Farseer', function() {
    integration(function() {
        describe('Iuchi Farseer\'s ability during conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden'],
                        dynastyDiscard: ['iuchi-farseer'],
                        hand: ['charge']
                    },
                    player2: {
                    }
                });

                this.iuchiFarseer = this.player1.placeCardInProvince('iuchi-farseer', 'province 1');

                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.shamefulDisplay3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.shamefulDisplay4 = this.player2.findCardByName('shameful-display', 'province 4');
            });

            it('should trigger when charged into play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shrine-maiden'],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.iuchiFarseer);
                expect(this.iuchiFarseer.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.iuchiFarseer);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay2);
                this.player1.clickCard(this.shamefulDisplay2);
                expect(this.shamefulDisplay2.facedown).toBe(false);

            });
        });

        describe('Iuchi Farseer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['iuchi-farseer']
                    },
                    player2: {
                    }
                });

                this.iuchiFarseer = this.player1.placeCardInProvince('iuchi-farseer', 'province 1');

                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.shamefulDisplay3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.shamefulDisplay4 = this.player2.findCardByName('shameful-display', 'province 4');
            });

            it('should trigger when it enters play', function() {
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.iuchiFarseer);
            });

            it('should prompt to select an opponent\'s province', function() {
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.iuchiFarseer);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay2);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay3);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay4);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay);
            });

            it('should reveal the chosen province', function() {
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickCard(this.shamefulDisplay2);
                expect(this.shamefulDisplay1.facedown).toBe(true);
                expect(this.shamefulDisplay2.facedown).toBe(false);
                expect(this.shamefulDisplay3.facedown).toBe(true);
                expect(this.shamefulDisplay4.facedown).toBe(true);
            });
        });
    });
});

