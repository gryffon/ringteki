describe('Ikoma Ikehata', function() {
    integration(function() {
        describe('Ikoma Ikehata\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-ikehata','akodo-toturi'],
                        hand: ['fine-katana','ornate-fan']
                    },
                    player2: {
                        inPlay: ['miya-mystic']
                    }
                });
                this.ikehata = this.player1.findCardbyName('ikoma-ikehata');
                this.toturi = this.player1.findCardbyName('akodo-toturi');

                this.mystic = this.player2.findCardbyName('miya-mystic');
                this.noMoreActions();
            });

            it('should trigger only after winning a political conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: 'ikoma-ikehata',
                    defenders: 'miya-mystic',
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).not.toBeAbletoSelect(this.ikehata);
            });

        });
    });
});
