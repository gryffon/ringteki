describe('Quarrelsome Youth', function() {
    integration(function() {
        describe('Quarrelsome Youth\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['quarrelsome-youth', 'kakita-yoshi', 'akodo-toturi'],
                        hand: ['favored-mount'],
                        conflictDiscard: ['way-of-the-crane', 'way-of-the-lion', 'way-of-the-dragon']
                    },
                    player2: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['assassination', 'duty']
                    }
                });

                this.player1.player.imperialFavor = 'political';

                this.youth = this.player1.findCardByName('quarrelsome-youth');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.toturi = this.player1.findCardByName('akodo-toturi');
                this.mount = this.player1.findCardByName('favored-mount');
                this.crane = this.player1.findCardByName('way-of-the-crane');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');

                this.player1.playAttachment(this.mount, this.toturi);

                this.player1.reduceDeckToNumber('conflict deck', 0);
                this.player1.moveCard('way-of-the-crane', 'conflict deck');
                this.player1.moveCard('way-of-the-lion', 'conflict deck');
                this.player1.moveCard('way-of-the-dragon', 'conflict deck');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.yoshi],
                    defenders: [this.kuwanan]
                });
                this.player2.pass();
            });

            it('should make your opponent discard a card at random if you have fewer cards when youth loses conflict as an attacker', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.youth);
                let player2hand = this.player2.player.hand.size();
                this.player1.clickCard(this.youth);
                expect(this.player2).not.toHavePrompt('Choose a card to discard');
                expect(this.player2.player.hand.size()).toBe(player2hand - 1);
                expect(this.getChatLog(1)).toContain('player1 uses Quarrelsome Youth to make player2 discard 1 cards at random');
            });

            it('should not make your opponent discard a card at random if you have more cards when youth loses conflict as an attacker', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yoshi);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.youth);
                let player2hand = this.player2.player.hand.size();
                expect(this.player2.player.hand.size()).toBe(player2hand);
            });

            it('should not make your opponent discard a card at random if you have equal cards when youth loses conflict as an attacker', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yoshi);
                this.player2.pass();
                this.player1.clickCard(this.crane);
                this.player1.clickCard(this.yoshi);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.youth);
                let player2hand = this.player2.player.hand.size();
                expect(this.player2.player.hand.size()).toBe(player2hand);
            });

            it('should not make your opponent discard a card at random if youth wins conflict as an attacker', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.mount);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.youth);
                let player2hand = this.player2.player.hand.size();
                expect(this.player2.player.hand.size()).toBe(player2hand);
            });

            it('should not make your opponent discard a card at random if youth loses conflict as a defender', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Pass');

                this.kuwanan.bowed = false;
                this.youth.bowed = false;

                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.kuwanan],
                    defenders: [this.youth]
                });

                this.noMoreActions();

                expect(this.player1).not.toBeAbleToSelect(this.youth);
                let player2hand = this.player2.player.hand.size();
                expect(this.player2.player.hand.size()).toBe(player2hand);
            });
        });
    });
});
