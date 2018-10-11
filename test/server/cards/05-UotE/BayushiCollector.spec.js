describe('Bayushi Collector', function() {
    integration(function() {
        describe('Bayushi Collector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-collector','bayushi-liar'],
                        hand: ['fine-katana','ornate-fan']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.collector = this.player1.findCardByName('bayushi-collector');
                this.liar = this.player1.findCardByName('bayushi-liar');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');

            });

            it('should only target attachments of dishonored characters', function() {
                this.liar.dishonor();
                this.player1.clickCard(this.fan);
                this.player1.clickCard(this.liar);
                expect(this.liar.attachments.toArray()).toContain(this.fan);
                this.player1.clickCard(this.collector);
                expect(this.player1).toBeAbleToSelect(this.fan);
                this.player1.clickCard(this.fan);
                expect(this.fan.location).toBe('conflict discard pile');
            });

            it('should not trigger under ABC circumstances', function() {

            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
