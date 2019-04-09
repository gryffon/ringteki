fdescribe('Moto Chagatai', function() {
    integration(function() {
        describe('Moto Chagatai\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['moto-chagatai', 'shrine-maiden'],
                        hand:[]
                    },
                    player2: {
                        inPlay: ['steward-of-law'],
                        hand: ['for-shame', 'tailsman-of-the-sun'],
                        provinces: ['public-forum', 'endless-plains']
                    }
                });

                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
                this.steward = this.player2.findCardByName('steward-of-law');

                this.endlessPlains = this.player2.findCardByName('endless-plains', 'province 1');
                this.publicForum = this.player2.findCardByName('public-forum', 'province 1');

                this.noMoreActions();
            });

            it('should work if a opponent uses endless plains and moves the conflict', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.chagatai, this.shrineMaiden],
                    defenders: [this.steward],
                    province: this.endlessPlains
                });

                this.player2.clickCard(this.endlessPlains);
                this.player1.clickCard(this.shrineMaiden);
                this.player2.playAttachment('tailsman-of-the-sun', this.steward);
                this.player1.pass();
                this.player2.clickCard('tailsman-of-the-sun');
                this.player2.clickCard(this.publicForum);
                this.player1.pass();
                this.player2.pass();
                expect(this.chagatai.bowed).toBe(false);
            });
        });
    });
});
