describe('Upholding Authority', function() {
    integration(function() {
        describe('Upholding Authority\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['banzai', 'banzai', 'banzai', 'charge', 'court-games']
                    },
                    player2: {
                        provinces: ['upholding-authority']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.chat = spyOn(this.game, 'addMessage');
            });

            it('should trigger when it is broken', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('upholding-authority');
            });

            it('should prompt the player to choose a card', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.player2.currentButtons).toContain('Charge!');
                expect(this.player2.currentButtons).toContain('Don\'t discard anything');
            });

            it('should not discard anything if the player clicks that option', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.handSize = this.player1.hand.length;
                this.player2.clickPrompt('Don\'t discard anything');
                expect(this.player1.hand.length).toBe(this.handSize);
                expect(this.player1).toHavePrompt('Break Upholding Authority');
            });

            it('should discard the card if the player only has a single copy', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.charge = this.player1.findCardByName('charge');
                this.player2.clickPrompt('Charge!');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
            });

            it('should ask the player how many cards to discard if the player picks a card with multiple copies', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.player2.clickPrompt('Banzai! (3)');
                expect(this.player2).toHavePrompt('Choose how many cards to discard');
                expect(this.player2.currentButtons).toContain('1');
                expect(this.player2.currentButtons).toContain('2');
                expect(this.player2.currentButtons).toContain('3');
            });

            it('should discard the correct number of cards if the player picks a card with multiple copies (1 chosen)', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.banzaiCards = this.player1.filterCardsByName('banzai');
                this.banzai1 = this.banzaiCards[0];
                this.banzai2 = this.banzaiCards[1];
                this.banzai3 = this.banzaiCards[2];
                this.player2.clickPrompt('Banzai! (3)');
                this.player2.clickPrompt('1');
                expect(this.banzai1.location).toBe('conflict discard pile');
                expect(this.banzai2.location).toBe('hand');
                expect(this.banzai3.location).toBe('hand');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
                expect(this.chat).toHaveBeenCalledWith('{0} chooses to discard {1} cop{2} of {3}', this.player2.player, '1', 'y', this.banzai1);
            });

            it('should discard the correct number of cards if the player picks a card with multiple copies (2 chosen)', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.banzaiCards = this.player1.filterCardsByName('banzai');
                this.banzai1 = this.banzaiCards[0];
                this.banzai2 = this.banzaiCards[1];
                this.banzai3 = this.banzaiCards[2];
                this.player2.clickPrompt('Banzai! (3)');
                this.player2.clickPrompt('2');
                expect(this.banzai1.location).toBe('conflict discard pile');
                expect(this.banzai2.location).toBe('conflict discard pile');
                expect(this.banzai3.location).toBe('hand');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
                expect(this.chat).toHaveBeenCalledWith('{0} chooses to discard {1} cop{2} of {3}', this.player2.player, '2', 'ies', this.banzai1);
            });

            it('should discard the correct number of cards if the player picks a card with multiple copies (3 chosen)', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.banzaiCards = this.player1.filterCardsByName('banzai');
                this.banzai1 = this.banzaiCards[0];
                this.banzai2 = this.banzaiCards[1];
                this.banzai3 = this.banzaiCards[2];
                this.player2.clickPrompt('Banzai! (3)');
                this.player2.clickPrompt('3');
                expect(this.banzai1.location).toBe('conflict discard pile');
                expect(this.banzai2.location).toBe('conflict discard pile');
                expect(this.banzai3.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
                expect(this.chat).toHaveBeenCalledWith('{0} chooses to discard {1} cop{2} of {3}', this.player2.player, '3', 'ies', this.banzai1);
            });
        });

        describe('Upholding Authority\'s ability when the opponent has zero cards in hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: []
                    },
                    player2: {
                        provinces: ['upholding-authority']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
            });

            it('should not be able to be triggered', function() {
                expect(this.player1.player.hand.size()).toBe(0);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
            });
        });

    });
});
