describe('Dishonorable Assault', function() {
    integration(function() {
        describe('Dishonorable Assault\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth', 'doji-whisperer', 'shinjo-ambusher'],
                    },
                    player2: {
                        provinces: ['dishonorable-assault'],
                        hand: ['fine-katana','ornate-fan', 'assassination']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.whisperer = this.player1.findCardByName('doji-whisperer');

                this.ambusher.dishonor();

                this.assault = this.player2.findCardByName('dishonorable-assault');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should only target another faceup province unbroken province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 2 cards to discard');
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.assassination);
                // expect(this.player2).toHavePromptButton('Cancel');

                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                // this.player2.clickCard(this.assassination);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.youth);

                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickPrompt('Done');

                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);
            });
        });
    });
});
