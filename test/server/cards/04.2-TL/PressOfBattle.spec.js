describe('Press of Battle', function() {
    integration(function() {
        describe('Press of Battle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'aggressive-moto', 'giver-of-gifts'],
                        hand: ['press-of-battle']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-hotaru', 'cautious-scout']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.aggresiveMoto = this.player1.findCardByName('aggressive-moto');
                this.giverOfGifts = this.player1.findCardByName('giver-of-gifts');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.cautiousScout = this.player2.findCardByName('cautious-scout');

                this.pressOfBattle = this.player1.findCardByName('press-of-battle');
            });

            it('should not trigger outside of a military conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.pressOfBattle);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.aggresiveMoto],
                    defenders: [this.dojiWhisperer],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.pressOfBattle);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if you have the same or fewer characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.pressOfBattle);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose a non-unique participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.aggresiveMoto, this.giverOfGifts],
                    defenders: [this.dojiWhisperer, this.dojiHotaru]
                });
                this.player2.pass();
                this.player1.clickCard(this.pressOfBattle);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).toBeAbleToSelect(this.aggresiveMoto);
                expect(this.player1).toBeAbleToSelect(this.giverOfGifts);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
                expect(this.player1).not.toBeAbleToSelect(this.cautiousScout);
            });

            it('should bow the chosen character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.aggresiveMoto, this.giverOfGifts],
                    defenders: [this.dojiWhisperer, this.dojiHotaru]
                });
                this.player2.pass();
                this.player1.clickCard(this.pressOfBattle);
                expect(this.dojiWhisperer.bowed).toBe(false);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(true);
            });
        });
    });
});
