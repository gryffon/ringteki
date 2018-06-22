describe('Feral Ningyo', function() {
    integration(function() {
        describe('Feral Ningyo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['feral-ningyo']
                    }
                });
            });

            it('should not activate during non-water conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('feral-ningyo');
                expect(this.player1).toHavePrompt('Initiate an action');
                //this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
                // expect(this.player1).toHavePrompt('Triggered Abilities');
                // this.player1.clickCard(this.iuchiWayfinder);
                // expect(this.player1).toHavePrompt('Iuchi Wayfinder');
                // expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                // expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay2);
            });

            it('should not activate during non-water conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('feral-ningyo');
                expect(this.player1).toHavePrompt('Initiate an action');
                //this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
                // expect(this.player1).toHavePrompt('Triggered Abilities');
                // this.player1.clickCard(this.iuchiWayfinder);
                // expect(this.player1).toHavePrompt('Iuchi Wayfinder');
                // expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                // expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay2);
            });


            // it('should display a message in chat when a province is chosen', function() {
            //     this.chat = spyOn(this.game, 'addMessage');
            //     this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
            //     this.player1.clickCard(this.iuchiWayfinder);
            //     this.player1.clickCard(this.shamefulDisplay1);
            //     expect(this.chat).toHaveBeenCalledWith('{0} reveals {1}', this.iuchiWayfinder, [this.shamefulDisplay1]);
            // });
        });
    });
});
