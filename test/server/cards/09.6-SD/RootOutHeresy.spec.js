describe('Root Out Heresy', function() {
    integration(function() {
        describe('Root Out Heresy\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-outrider'],
                        hand: ['root-out-heresy']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['mirumoto-s-fury'],
                        conflictDiscard: ['root-out-heresy']
                    }
                });
                this.moto = this.player1.findCardByName('moto-outrider');
                this.root = this.player1.findCardByName('root-out-heresy');
                this.p2Root = this.player2.findCardByName('root-out-heresy');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.fury = this.player2.findCardByName('mirumoto-s-fury');

                this.shameful1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.shameful2 = this.player2.findCardByName('shameful-display', 'province 1');
                this.noMoreActions();
            });

            it('should not work in a mil conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.moto],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.root);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should discard a random card in a pol conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.moto],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.root);
                expect(this.fury.location).toBe('conflict discard pile');
            });

            it('should reduce the attacked provinces strength', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.moto],
                    defenders: [this.whisperer],
                    province: this.shameful2
                });
                let strength = this.shameful2.strength;
                this.player2.pass();
                this.player1.clickCard(this.root);
                expect(this.fury.location).toBe('conflict discard pile');
                expect(this.shameful2.strength).toBe(strength - 1);
            });

            it('should reduce the attacked provinces strength on defense', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.moto],
                    defenders: [this.whisperer],
                    province: this.shameful2
                });
                this.player2.moveCard(this.p2Root, 'hand');
                let strength = this.shameful2.strength;
                this.player2.clickCard(this.p2Root);
                expect(this.root.location).toBe('conflict discard pile');
                expect(this.shameful2.strength).toBe(strength - 1);
            });

            it('should not work your opponent has no cards', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.moto],
                    defenders: [this.whisperer],
                    province: this.shameful2
                });
                let strength = this.shameful2.strength;
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.moto);
                this.player1.clickCard(this.root);
                expect(this.shameful2.strength).toBe(strength);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
