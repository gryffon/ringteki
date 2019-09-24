describe('Regal Bearing', function() {
    integration(function() {
        describe('Regal Bearing\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-prodigy', 'akodo-makoto'],
                        hand: ['regal-bearing', 'game-of-sadane']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro']
                    }
                });
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.akodoMakoto = this.player1.findCardByName('akodo-makoto');
                this.regalBearing = this.player1.findCardByName('regal-bearing');
                this.gameOfSadane = this.player1.findCardByName('game-of-sadane');
                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
            });

            it('only works during a political conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.regalBearing);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('only works during a political where you have a participating courtier', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoMakoto],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.regalBearing);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('draws cards equal to the difference between honor bids', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });
                expect(this.player1.conflictDeck.length).toBe(8);


                this.player2.pass();

                this.player1.clickCard(this.gameOfSadane);
                this.player1.clickCard(this.ikomaProdigy);
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');

                this.player2.pass();
                this.player1.clickCard(this.regalBearing);

                expect(this.player1.conflictDeck.length).toBe(4);
            });
        });
    });
});

