describe('Saadiyah al-Mozedu', function() {
    integration(function() {
        describe('Saadiyah al-Mozedu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['saadiyah-al-mozedu','moto-youth'],
                        provinces: ['endless-plains'],
                        hand: ['fine-katana','ornate-fan']
                    },
                    player2: {
                        provinces: ['sacred-sanctuary', 'magistrate-station','shameful-display']
                    }
                });

                this.saadiyah = this.player1.findCardByName('saadiyah-al-mozedu');
                this.katana = this.player1.findCardByName('fine-katana');
                this.endlessPlains = this.player1.findCardByName('endless-plains');

                this.sanctuary = this.player2.findCardByName('sacred-sanctuary');
                this.station = this.player2.findCardByName('magistrate-station');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display');
                this.sanctuary.facedown = false;
                this.station.facedown = false;
                this.endlessPlains.facedown = false;
                this.shamefulDisplay.facedown = false;
                this.shamefulDisplay.isBroken = true;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.saadiyah],
                    defenders: [],
                    province: this.station
                });
            });

            it('should only target a non-attacked unbroken province', function() {
                this.player2.pass();
                this.player1.clickCard(this.saadiyah);
                expect(this.player1).toHavePrompt('Choose a province');
                expect(this.player1).toBeAbleToSelect(this.sanctuary);
                expect(this.player1).toBeAbleToSelect(this.endlessPlains);
                expect(this.player1).not.toBeAbleToSelect(this.station);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay);
            });

            it('should discard a card as a cost', function() {
                this.player2.pass();
                this.player1.clickCard(this.saadiyah);
                this.player1.clickPrompt('Pay Costs First');
                expect(this.player1).toHavePrompt('Select card to discard');
                expect(this.player1).toBeAbleToSelect('fine-katana');
                expect(this.player1).toBeAbleToSelect('ornate-fan');
                this.player1.clickCard(this.katana);
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Choose a province');
            });

            it('should turn the chosen province facedown', function() {
                this.player2.pass();
                this.player1.clickCard(this.saadiyah);
                this.player1.clickCard(this.sanctuary);
                this.player1.clickCard(this.katana);
                expect(this.sanctuary.facedown).toBe(true);
                expect(this.katana.location).toBe('conflict discard pile');
            });
        });
    });
});
