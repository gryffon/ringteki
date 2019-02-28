describe('Warm Welcome', function() {
    integration(function() {
        describe('Warm Welcome\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-master'],
                        hand: ['warm-welcome'],
                        conflictDiscard: ['tattooed-wanderer', 'hurricane-punch', 'banzai']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.warmWelcome = this.player1.findCardByName('warm-welcome');
                this.nitenMaster = this.player1.findCardByName('niten-master');
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.hurricanePunch = this.player1.findCardByName('hurricane-punch');
                this.banzai = this.player1.findCardByName('banzai');
                this.player1.player.showBid = 4;
                this.player2.player.showBid = 5;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nitenMaster],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should not be able to be played if bid dial is equal or higher than opponent', function() {
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 5;
                this.game.checkGameState(true);
                this.player1.clickCard(this.warmWelcome);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 4;
                this.game.checkGameState(true);
                this.player1.clickCard(this.warmWelcome);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow playing a conflict character', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.warmWelcome);
                expect(this.player1).toHavePrompt('Warm Welcome');
                this.player1.clickCard(this.tattooedWanderer);
                expect(this.player1).toHavePrompt('Tattooed Wanderer');
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.tattooedWanderer.inConflict).toBe(true);
            });

            it('should allow playing an event and place that event on the bottom of the conflict deck', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.warmWelcome);
                expect(this.player1).toHavePrompt('Warm Welcome');
                this.player1.clickCard(this.banzai);
                expect(this.player1).toHavePrompt('Banzai!');
                this.player1.clickCard(this.nitenMaster);
                this.player1.clickPrompt('Done');
                expect(this.nitenMaster.militarySkill).toBe(5);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.player1.player.conflictDeck.last()).toBe(this.banzai);
            });

            it('should allow placing an event on the bottom of the conflict deck even if it cannot be played', function() {
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.warmWelcome);
                expect(this.player1).toHavePrompt('Warm Welcome');
                this.player1.clickCard(this.hurricanePunch);
                expect(this.nitenMaster.militarySkill).toBe(3);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.player1.player.conflictDeck.last()).toBe(this.hurricanePunch);
            });
        });

        describe('Multiple Warm Welcomes', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        conflictDiscard: ['warm-welcome', 'warm-welcome'],
                        hand: ['warm-welcome']
                    }
                });

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
            });

            it('should not cause an infinite loop', function() {
                this.player1.clickCard('warm-welcome', 'hand');
                expect(this.player1).toHavePrompt('Warm Welcome');
            });
        });
    });
});
