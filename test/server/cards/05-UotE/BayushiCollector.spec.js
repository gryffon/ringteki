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
                this.katana = this.player1.playAttachment('fine-katana', this.collector);
                this.fan = this.player1.playAttachment('ornate-fan', this.liar);

            });

            it('should only target attachments of dishonored characters', function() {
                this.liar.dishonor();
                this.player1.clickCard(this.collector);
                expect(this.player1).not.toBeAbleToSelect(this.katana);
                expect(this.player1).toBeAbleToSelect(this.fan);
            });

            it('should not trigger under ABC circumstances', function() {

            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
