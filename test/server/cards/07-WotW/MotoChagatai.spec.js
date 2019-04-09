describe('Moto Chagatai', function() {
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
                        hand: ['for-shame', 'talisman-of-the-sun'],
                        provinces: ['public-forum', 'endless-plains', 'fertile-fields']
                    }
                });

                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
                this.steward = this.player2.findCardByName('steward-of-law');

                this.endlessPlains = this.player2.findCardByName('endless-plains');
                this.publicForum = this.player2.findCardByName('public-forum');
                this.fertileFields = this.player2.findCardByName('fertile-fields');

                this.noMoreActions();
            });

            it('should prevent chagatai if a province is broken on attack', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.fertileFields,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });
                expect(this.chagatai.bowed).toBe(false);
                expect(this.fertileFields.isBroken).toBe(true);
            });

            it('should not trigger if public forum is used', function () {
                this.initiateConflict({
                    type: 'military',
                    province: this.publicForum,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });

                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.publicForum);
                expect(this.chagatai.bowed).toBe(true);
                expect(this.publicForum.isBroken).toBe(false);
            });

            it('should work if a opponent uses endless plains and moves the conflict', function () {
                this.initiateConflict({
                    type: 'political',
                    province: this.endlessPlains,
                    attackers: [this.chagatai, this.shrineMaiden]
                });

                this.player2.clickCard(this.endlessPlains);
                this.player1.clickPrompt('Yes');
                this.player1.clickCard(this.shrineMaiden);
                this.player2.clickPrompt('Pass');
                this.player2.clickCard(this.steward);
                this.player2.clickPrompt('Done');
                this.player2.playAttachment('talisman-of-the-sun', this.steward);
                this.player1.pass();
                this.player2.clickCard('talisman-of-the-sun');
                this.player2.clickCard(this.publicForum);
                this.player1.pass();
                this.player2.pass();
                expect(this.chagatai.bowed).toBe(false);
                expect(this.endlessPlains.isBroken).toBe(true);
                expect(this.publicForum.isBroken).toBe(false);
            });
        });
    });
});
