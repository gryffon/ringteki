describe('Castigated', function() {
    integration(function() {
        describe('Castigated\'s play restrictions', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['castigated'],
                        dynastyDiscard: ['imperial-storehouse'],
                        conflictDiscard: ['bayushi-kachiko'],
                        provinces: ['before-the-throne']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger']
                    }
                });
                this.shoju = this.player1.findCardByName('bayushi-shoju');
                this.throne = this.player1.findCardByName('before-the-throne');
                this.castigated = this.player1.findCardByName('castigated');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');

                this.throne.facedown = true;
                this.noMoreActions();
            });

            it('should not be playable without an imperial character', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial holding', function() {
                this.player1.placeCardInProvince(this.storehouse, 'province 1');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable with just an imperial province', function() {
                this.throne.facedown = false;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be playable on a participating character an imperial character', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Castigated');
                expect(this.player1).toBeAbleToSelect(this.shoju);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.kachiko);
            });

            it('should not be playable during a mil conflict', function() {
                this.player1.moveCard(this.kachiko, 'play area');
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shoju],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Castigated\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-kachiko'],
                        hand: ['castigated', 'mark-of-shame']
                    },
                    player2: {
                        inPlay: ['asahina-artisan', 'doji-challenger', 'matsu-berserker'],
                        hand: ['reprieve', 'calling-in-favors'],
                        dynastyDiscard: ['iron-mine']
                    }
                });
                this.castigated = this.player1.findCardByName('castigated');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.mark = this.player1.findCardByName('mark-of-shame');

                this.berserker = this.player2.findCardByName('matsu-berserker'); //immune
                this.artisan = this.player2.findCardByName('asahina-artisan'); //dies immediately
                this.challenger = this.player2.findCardByName('doji-challenger'); //dies to MoS
                this.calling = this.player2.findCardByName('calling-in-favors');
                this.reprieve = this.player2.findCardByName('reprieve');
                this.mine = this.player2.findCardByName('iron-mine');

                this.noMoreActions();
            });

            it('should discard immediately if character has 0 skill', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko],
                    defenders: [this.artisan]
                });
                this.player2.pass();
                this.player1.clickCard(this.castigated);
                this.player1.clickCard(this.artisan);
                expect(this.artisan.location).toBe('dynasty discard pile');
                expect(this.castigated.location).toBe('conflict discard pile');
                expect(this.getChatLogs(3)).toContain('Asahina Artisan is discarded by Castigated');
            });

            it('should discard as soon as character drops to 0 skill', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko],
                    defenders: [this.challenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.castigated);
                this.player1.clickCard(this.challenger);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');

                this.player1.clickCard(this.mark);
                this.player1.clickCard(this.challenger);
                this.player1.clickCard(this.mark);
                expect(this.challenger.location).toBe('dynasty discard pile');
                expect(this.castigated.location).toBe('conflict discard pile');
                expect(this.mark.location).toBe('conflict discard pile');
                expect(this.getChatLogs(2)).toContain('Doji Challenger is discarded by Castigated');
            });

            it('should not discard a dash', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko],
                    defenders: [this.challenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.castigated);
                this.player1.clickCard(this.challenger);
                this.player2.clickCard(this.calling);
                this.player2.clickCard(this.castigated);
                this.player2.clickCard(this.berserker);

                expect(this.berserker.location).toBe('play area');
                expect(this.castigated.location).toBe('play area');
                expect(this.berserker.attachments).toContain(this.castigated);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should discard through saves', function() {
                this.player2.placeCardInProvince(this.mine, 'province 1');
                this.mine.facedown = false;

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko],
                    defenders: [this.artisan]
                });
                this.player2.clickCard(this.reprieve);
                this.player2.clickCard(this.artisan);
                this.player1.clickCard(this.castigated);
                this.player1.clickCard(this.artisan);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.reprieve);
                expect(this.player2).toBeAbleToSelect(this.mine);
                this.player2.clickCard(this.reprieve);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.mine);
                this.player2.clickCard(this.mine);

                expect(this.artisan.location).toBe('dynasty discard pile');
                expect(this.castigated.location).toBe('conflict discard pile');
                expect(this.reprieve.location).toBe('conflict discard pile');
                expect(this.mine.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(7)).toContain('Asahina Artisan is discarded by Castigated');
                expect(this.getChatLogs(6)).toContain('player2 uses Reprieve to prevent Asahina Artisan from leaving play');
                expect(this.getChatLogs(5)).toContain('Asahina Artisan is discarded by Castigated');
                expect(this.getChatLogs(4)).toContain('player2 uses Iron Mine to prevent Asahina Artisan from leaving play');
                expect(this.getChatLogs(3)).toContain('Asahina Artisan is discarded by Castigated');
            });
        });
    });
});
